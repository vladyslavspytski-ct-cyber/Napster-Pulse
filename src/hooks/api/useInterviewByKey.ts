import { useState, useCallback, useEffect } from "react";
import { callApi } from "@/lib/api";
import { API_ROUTES } from "@/lib/apiRoutes";

interface Interview {
  id: string;
  key: string;
  title: string;
  questions: string[];
}

interface UseInterviewByKeyOptions {
  enabled?: boolean;
}

interface UseInterviewByKeyResult {
  interview: Interview | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useInterviewByKey(
  key: string | undefined,
  options: UseInterviewByKeyOptions = {},
): UseInterviewByKeyResult {
  const { enabled = true } = options;

  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchInterview = useCallback(async () => {
    if (!key) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await callApi<Interview>(API_ROUTES.interviewByKey(key));
      setInterview(response);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch interview");
      setError(error);
      console.error("[useInterviewByKey] Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  useEffect(() => {
    if (enabled && key) {
      fetchInterview();
    }
  }, [enabled, key, fetchInterview]);

  return {
    interview,
    isLoading,
    error,
    refetch: fetchInterview,
  };
}
