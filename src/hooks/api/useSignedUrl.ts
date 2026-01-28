import { useState, useCallback, useEffect } from "react";
import { callApi } from "@/lib/api";
import { API_ROUTES } from "@/lib/apiRoutes";

interface UseSignedUrlOptions {
  enabled?: boolean;
}

interface UseSignedUrlResult {
  signedUrl: string | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<string | null>;
  fetchSignedUrl: () => Promise<string>;
}

/**
 * Parse signed URL from API response (supports both JSON and text formats)
 */
function parseSignedUrlResponse(data: string | Record<string, unknown>): string {
  // Handle plain text response
  if (typeof data === "string") {
    if (!data.trim()) {
      throw new Error("Empty signed URL received from backend");
    }
    return data.trim();
  }

  // Handle JSON response - support both signed_url and signedUrl
  if (typeof data === "object" && data) {
    const signed =
      (typeof data.signedUrl === "string" && data.signedUrl) ||
      (typeof data.signed_url === "string" && data.signed_url) ||
      (typeof data.url === "string" && data.url);

    if (signed) return signed.trim();
  }

  throw new Error("Invalid response: missing signedUrl field");
}

export function useSignedUrl(
  agentId: string | null,
  options: UseSignedUrlOptions = {},
): UseSignedUrlResult {
  const { enabled = true } = options;

  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch signed URL and update state. Returns the URL or null on error.
   */
  const refetch = useCallback(async (): Promise<string | null> => {
    if (!agentId) return null;

    setIsLoading(true);
    setError(null);

    try {
      const path = `${API_ROUTES.signedUrl}?agentId=${encodeURIComponent(agentId)}`;
      const data = await callApi<string | Record<string, unknown>>(path);
      const url = parseSignedUrlResponse(data);
      setSignedUrl(url);
      return url;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch signed URL");
      setError(error);
      console.error("[useSignedUrl] Error:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [agentId]);

  /**
   * Fetch signed URL imperatively. Throws on error.
   * Use this when you need the URL immediately and want to handle errors yourself.
   */
  const fetchSignedUrl = useCallback(async (): Promise<string> => {
    if (!agentId) {
      throw new Error("No agent ID provided");
    }

    setIsLoading(true);
    setError(null);

    try {
      const path = `${API_ROUTES.signedUrl}?agentId=${encodeURIComponent(agentId)}`;
      const data = await callApi<string | Record<string, unknown>>(path);
      const url = parseSignedUrlResponse(data);
      setSignedUrl(url);
      return url;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch signed URL");
      setError(error);
      console.error("[useSignedUrl] Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    if (enabled && agentId) {
      refetch();
    }
  }, [enabled, agentId, refetch]);

  return {
    signedUrl,
    isLoading,
    error,
    refetch,
    fetchSignedUrl,
  };
}
