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
  fetchSignedUrl: (agentIdOverride?: string | null) => Promise<string>;
}

function parseSignedUrlResponse(data: string | Record<string, unknown>): string {
  if (typeof data === "string") {
    const trimmed = data.trim();
    if (!trimmed) throw new Error("Empty signed URL received from backend");
    return trimmed;
  }

  if (typeof data === "object" && data) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyData = data as any;
    const signed =
      (typeof anyData.signedUrl === "string" && anyData.signedUrl) ||
      (typeof anyData.signed_url === "string" && anyData.signed_url) ||
      (typeof anyData.url === "string" && anyData.url);

    if (signed) return String(signed).trim();
  }

  throw new Error("Invalid response: missing signedUrl field");
}

function buildSignedUrlPath(agentId?: string | null): string {
  if (!agentId) return API_ROUTES.signedUrl;
  return `${API_ROUTES.signedUrl}?agentId=${encodeURIComponent(agentId)}`;
}

export function useSignedUrl(
  agentId?: string | null,
  options: UseSignedUrlOptions = {},
): UseSignedUrlResult {
  const { enabled = true } = options;

  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const path = buildSignedUrlPath(agentId);
      const data = await callApi<string | Record<string, unknown>>(path);
      const url = parseSignedUrlResponse(data);
      setSignedUrl(url);
      return url;
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Failed to fetch signed URL");
      setError(e);
      console.error("[useSignedUrl] Error:", e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [agentId]);

  const fetchSignedUrl = useCallback(
    async (agentIdOverride?: string | null): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        const finalAgentId =
          typeof agentIdOverride !== "undefined" ? agentIdOverride : agentId;

        const path = buildSignedUrlPath(finalAgentId);
        const data = await callApi<string | Record<string, unknown>>(path);
        const url = parseSignedUrlResponse(data);
        setSignedUrl(url);
        return url;
      } catch (err) {
        const e = err instanceof Error ? err : new Error("Failed to fetch signed URL");
        setError(e);
        console.error("[useSignedUrl] Error:", e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [agentId],
  );

  useEffect(() => {
    if (enabled) {
      refetch();
    }
  }, [enabled, refetch]);

  return { signedUrl, isLoading, error, refetch, fetchSignedUrl };
}
