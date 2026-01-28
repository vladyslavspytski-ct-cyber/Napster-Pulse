import { useState, useCallback } from "react";
import { callApi } from "@/lib/api";
import { API_ROUTES } from "@/lib/apiRoutes";

export interface CreateInterviewPayload {
  title: string;
  questions: string[];
}

export interface CreateInterviewResponse {
  id: string;
  link_id: string;
  title: string;
  is_active: boolean;
  created_at: string;
}

interface UseCreateInterviewResult {
  createInterview: (payload: CreateInterviewPayload) => Promise<CreateInterviewResponse | null>;
  isLoading: boolean;
  error: Error | null;
  data: CreateInterviewResponse | null;
}

export function useCreateInterview(): UseCreateInterviewResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<CreateInterviewResponse | null>(null);

  const createInterview = useCallback(
    async (payload: CreateInterviewPayload): Promise<CreateInterviewResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await callApi<CreateInterviewResponse>(API_ROUTES.createInterview, {
          method: "POST",
          body: payload as unknown as BodyInit,
        });

        setData(response);
        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to create interview");
        setError(error);
        console.error("[useCreateInterview] Error:", error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    createInterview,
    isLoading,
    error,
    data,
  };
}
