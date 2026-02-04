import { BACKEND_BASE_URL } from "@/config";
import { getAuthToken, handleUnauthorized } from "@/hooks/useAuth";

/**
 * Public endpoints that should NOT have Authorization header.
 * These patterns match paths that are accessible without authentication.
 */
const PUBLIC_ENDPOINT_PATTERNS = [
  /^\/interview-by-key\/[^/]+$/, // /interview-by-key/:key
  /^\/elevenlabs\/signed-url\/key\/[^/]+\/interview-id\/[^/]+$/, // /elevenlabs/signed-url/key/:key/interview-id/:id
  /^\/login$/, // /login
];

/**
 * Check if a path is a public endpoint (no auth required)
 */
function isPublicEndpoint(path: string): boolean {
  return PUBLIC_ENDPOINT_PATTERNS.some((pattern) => pattern.test(path));
}

/**
 * Merge headers safely, ensuring auth headers take precedence for protected endpoints
 * but can be overridden by explicit init.headers if needed.
 * Order: Content-Type defaults < Auth headers < User-provided headers
 */
function buildHeaders(
  path: string,
  init?: RequestInit,
  isJsonBody?: boolean
): HeadersInit {
  const headers: Record<string, string> = {};

  // 1. Add Content-Type for JSON bodies (lowest priority, can be overridden)
  if (isJsonBody) {
    headers["Content-Type"] = "application/json";
  }

  // 2. Add Authorization for protected endpoints
  if (!isPublicEndpoint(path)) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // 3. Merge with user-provided headers (highest priority)
  // User headers can override Content-Type or even Authorization if needed
  if (init?.headers) {
    // Handle both HeadersInit formats
    if (init.headers instanceof Headers) {
      init.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(init.headers)) {
      init.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, init.headers);
    }
  }

  return headers;
}

/**
 * Generic API call function with error handling, JSON support, and auth.
 *
 * Features:
 * - Automatically adds Authorization header for protected endpoints
 * - Skips auth header for public endpoints (interview-by-key, signed-url, login)
 * - Auto-stringifies object bodies and sets Content-Type
 * - Auto-logs out on 401 and shows session expired toast
 * - Parses JSON responses automatically
 *
 * @param path - API path (e.g., "/health")
 * @param init - Optional fetch RequestInit options
 * @returns Parsed JSON response or text
 */
export async function callApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${BACKEND_BASE_URL}${path}`;

  // Check if body needs JSON stringification
  const needsJsonStringify =
    init?.body &&
    typeof init.body === "object" &&
    !(init.body instanceof FormData) &&
    !(init.body instanceof Blob) &&
    !(init.body instanceof ArrayBuffer) &&
    !(init.body instanceof URLSearchParams);

  // Build headers with proper precedence
  const headers = buildHeaders(path, init, needsJsonStringify);

  // Build final request init
  const finalInit: RequestInit = {
    ...init,
    headers,
    body: needsJsonStringify ? JSON.stringify(init.body) : init?.body,
  };

  const response = await fetch(url, finalInit);

  // Handle 401 Unauthorized - auto-logout (only for protected endpoints)
  if (response.status === 401 && !isPublicEndpoint(path)) {
    // handleUnauthorized returns true if this is the first handler
    // (prevents duplicate toasts from concurrent 401 responses)
    const isFirstHandler = handleUnauthorized();

    if (isFirstHandler) {
      // Only show toast once per batch of 401s
      window.dispatchEvent(
        new CustomEvent("auth:session-expired", {
          detail: { message: "Session expired. Please log in again." },
        })
      );
    }

    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  // Handle empty responses (204 No Content, etc.)
  const contentLength = response.headers.get("content-length");
  if (response.status === 204 || contentLength === "0") {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return response.text() as Promise<T>;
}
