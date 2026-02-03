import { useState, useCallback, useEffect, useRef } from "react";
import { callApi } from "@/lib/api";
import { API_ROUTES } from "@/lib/apiRoutes";

export interface CompletedInterviewListItem {
  id: string;
  title: string;
  is_active: boolean;
  completed_count: number;
  link: {
    id: string;
    unique_key: string;
    created_at: string;
  } | null;
  questions: number;
}

interface CompletedInterviewsResponse {
  data: CompletedInterviewListItem[];
  total: number;
  limit: number;
  offset: number;
}

interface UseCompletedInterviewsOptions {
  limit?: number;
  offset?: number;
  search?: string;
  enabled?: boolean;
}

interface UseCompletedInterviewsResult {
  interviews: CompletedInterviewListItem[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useCompletedInterviews(
  options: UseCompletedInterviewsOptions = {}
): UseCompletedInterviewsResult {
  const { limit = 10, offset = 0, search = "", enabled = true } = options;

  const [interviews, setInterviews] = useState<CompletedInterviewListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Track if this is the initial fetch to avoid showing error on mount
  const hasFetchedRef = useRef(false);

  const fetchInterviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await callApi<CompletedInterviewsResponse>(
        API_ROUTES.completedInterviewsList({ limit, offset, search })
      );
      // Defensive: ensure data is always an array and total is always a number
      setInterviews(Array.isArray(response?.data) ? response.data : []);
      setTotal(typeof response?.total === "number" ? response.total : 0);
      hasFetchedRef.current = true;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to fetch completed interviews");
      setError(error);
      console.error("[useCompletedInterviews] Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [limit, offset, search]);

  useEffect(() => {
    if (enabled) {
      fetchInterviews();
    }
  }, [enabled, fetchInterviews]);

  return {
    interviews,
    total,
    isLoading,
    error,
    refetch: fetchInterviews,
  };
}
