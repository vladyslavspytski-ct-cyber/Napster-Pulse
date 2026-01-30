import { useState, useCallback, useEffect, useRef } from "react";
import { callApi } from "@/lib/api";
import { API_ROUTES } from "@/lib/apiRoutes";

export interface InterviewListItem {
  id: string;
  title: string;
  is_active: boolean;
  completed_count: number;
  link: {
    unique_key: string;
    created_at: string;
  } | null;
  questions: Array<{
    text: string;
    order: number;
  }>;
}

interface InterviewsResponse {
  data: InterviewListItem[];
  total: number;
  limit: number;
  offset: number;
}

interface UseInterviewsOptions {
  limit?: number;
  offset?: number;
  search?: string;
  enabled?: boolean;
}

interface UseInterviewsResult {
  interviews: InterviewListItem[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useInterviews(options: UseInterviewsOptions = {}): UseInterviewsResult {
  const { limit = 10, offset = 0, search = "", enabled = true } = options;

  const [interviews, setInterviews] = useState<InterviewListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Track if this is the initial fetch to avoid showing error on mount
  const hasFetchedRef = useRef(false);

  const fetchInterviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await callApi<InterviewsResponse>(
        API_ROUTES.interviewsList({ limit, offset, search }),
      );
      setInterviews(response.data);
      setTotal(response.total);
      hasFetchedRef.current = true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch interviews");
      setError(error);
      console.error("[useInterviews] Error:", error);
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
