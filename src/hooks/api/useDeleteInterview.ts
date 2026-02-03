import { useState, useCallback } from "react";
import { callApi } from "@/lib/api";
import { API_ROUTES } from "@/lib/apiRoutes";

interface UseDeleteInterviewResult {
  deleteInterview: (id: string) => Promise<void>;
  isDeleting: boolean;
  error: Error | null;
}

export function useDeleteInterview(): UseDeleteInterviewResult {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteInterview = useCallback(async (id: string) => {
    setIsDeleting(true);
    setError(null);

    try {
      await callApi(API_ROUTES.deleteInterview(id), {
        method: "DELETE",
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to delete interview");
      setError(error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    deleteInterview,
    isDeleting,
    error,
  };
}
