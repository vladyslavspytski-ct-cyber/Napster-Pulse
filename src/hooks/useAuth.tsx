import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { BACKEND_BASE_URL } from "@/config";

// Token storage keys
const TOKEN_KEY = "interu_access_token";
const TOKEN_EXPIRY_KEY = "interu_token_expiry";

// Fallback token lifetime: 24 hours in milliseconds (used if JWT has no exp)
const FALLBACK_TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000;

// Buffer time: consider token expired 30 seconds before actual expiry
// This prevents edge cases where token expires mid-request
const EXPIRY_BUFFER_MS = 30 * 1000;

// Login response from backend
interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface AuthContextValue {
  isLoggedIn: boolean;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void; // Returns void (not Promise) since local logout is immediate
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Parse JWT payload to extract expiry time
 * Returns expiry timestamp in ms, or null if can't parse
 */
function parseJwtExpiry(token: string): number | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decode base64url payload
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed = JSON.parse(decoded);

    // exp is in seconds, convert to ms
    if (typeof parsed.exp === "number") {
      return parsed.exp * 1000;
    }
    return null;
  } catch {
    // If parsing fails, return null (will use fallback)
    return null;
  }
}

/**
 * Check if token is expired based on stored expiry time
 */
function isTokenExpired(): boolean {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiry) return true;
  // Consider expired if within buffer time of expiry
  return Date.now() > parseInt(expiry, 10) - EXPIRY_BUFFER_MS;
}

/**
 * Get stored token if valid, null if expired or missing
 * Note: This clears localStorage if token is expired
 */
function getStoredToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  if (isTokenExpired()) {
    // Clear expired token from storage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    return null;
  }
  return token;
}

/**
 * Store token with expiry (parses JWT exp or uses fallback)
 */
function storeToken(token: string): void {
  // Try to extract expiry from JWT
  const jwtExpiry = parseJwtExpiry(token);

  // Use JWT expiry if available, otherwise fallback to 24h from now
  const expiry = jwtExpiry ?? Date.now() + FALLBACK_TOKEN_LIFETIME_MS;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
}

/**
 * Clear stored token and expiry
 */
function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

// Flag to prevent duplicate unauthorized handling from concurrent 401s
let isHandlingUnauthorized = false;

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [isLoading, setIsLoading] = useState(false);

  // Check token expiry on mount and periodically
  useEffect(() => {
    const checkExpiry = () => {
      if (token && isTokenExpired()) {
        // Token expired - clear both storage and state
        clearStoredToken();
        setToken(null);
      }
    };

    // Check immediately
    checkExpiry();

    // Check every minute
    const interval = setInterval(checkExpiry, 60 * 1000);
    return () => clearInterval(interval);
  }, [token]);

  // Listen for unauthorized events from API layer
  useEffect(() => {
    const handleUnauthorizedEvent = () => {
      // Clear React state (localStorage already cleared by handleUnauthorized)
      setToken(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorizedEvent);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorizedEvent);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Login failed");
        throw new Error(errorText || "Invalid email or password");
      }

      const data: LoginResponse = await response.json();

      if (!data.access_token) {
        throw new Error("Invalid response from server");
      }

      // Store token (will parse JWT exp) and update state
      storeToken(data.access_token);
      setToken(data.access_token);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    // Get current token before clearing (needed for backend call)
    const currentToken = token;

    // Clear local state immediately (don't wait for backend)
    clearStoredToken();
    setToken(null);

    // Best-effort backend logout - fire and forget
    // We don't wait for this or handle errors since local state is already cleared
    if (currentToken) {
      fetch(`${BACKEND_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${currentToken}`,
        },
      }).catch(() => {
        // Silently ignore errors - local logout already succeeded
      });
    }
  }, [token]);

  const value: AuthContextValue = {
    isLoggedIn: !!token,
    token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Get current auth token for API calls
 * Returns null if no token or token is expired
 */
export function getAuthToken(): string | null {
  return getStoredToken();
}

/**
 * Handle 401 unauthorized response - clears auth and notifies app
 * Includes deduplication to prevent multiple concurrent 401s from causing issues
 * @returns true if this call handled the unauthorized, false if already being handled
 */
export function handleUnauthorized(): boolean {
  // Prevent duplicate handling from concurrent 401 responses
  if (isHandlingUnauthorized) {
    return false;
  }

  isHandlingUnauthorized = true;

  // Clear localStorage
  clearStoredToken();

  // Dispatch event so AuthProvider updates React state
  window.dispatchEvent(new CustomEvent("auth:unauthorized"));

  // Reset flag after a short delay to allow for any in-flight requests
  setTimeout(() => {
    isHandlingUnauthorized = false;
  }, 1000);

  return true;
}
