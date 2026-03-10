import { useState, useCallback, useEffect } from "react";
import { callApi } from "@/lib/api";
import { API_ROUTES } from "@/lib/apiRoutes";

export interface InterviewQuestion {
  id: string;
  interview_id: string;
  text: string;
  order: number;
}

export interface InterviewDetails {
  id: string;
  title: string;
  is_active: boolean;
  created_at: string;
  completed_count: number;
  introduction: string;
  questions: InterviewQuestion[];
  analysis_blueprint?: Record<string, unknown>;
  global_dashboard?: Record<string, unknown>;
}

interface UseInterviewDetailsOptions {
  enabled?: boolean;
}

interface UseInterviewDetailsResult {
  interview: InterviewDetails | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useInterviewDetails(
  id: string | undefined,
  options: UseInterviewDetailsOptions = {},
): UseInterviewDetailsResult {
  const { enabled = true } = options;

  const [interview, setInterview] = useState<InterviewDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchInterview = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await callApi<InterviewDetails>(API_ROUTES.interviewDetails(id));
      setInterview(response);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch interview");
      setError(error);
      console.error("[useInterviewDetails] Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (enabled && id) {
      fetchInterview();
    }
  }, [enabled, id, fetchInterview]);

  return {
    interview,
    isLoading,
    error,
    refetch: fetchInterview,
  };
}

// Update interview hook
interface UpdateInterviewData {
  introduction: string;
  questions: string[]; // Array of question texts
}

interface UseUpdateInterviewResult {
  updateInterview: (id: string, data: UpdateInterviewData) => Promise<void>;
  isUpdating: boolean;
  error: Error | null;
}

export function useUpdateInterview(): UseUpdateInterviewResult {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateInterview = useCallback(async (id: string, data: UpdateInterviewData) => {
    setIsUpdating(true);
    setError(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await callApi(API_ROUTES.updateInterview(id), {
        method: "PUT",
        body: data as any,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to update interview");
      setError(error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    updateInterview,
    isUpdating,
    error,
  };
}
