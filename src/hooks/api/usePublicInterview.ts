import { useState, useCallback } from "react";
import { callApi } from "@/lib/api";
import { API_ROUTES } from "@/lib/apiRoutes";

// Types for interview data from backend
// Note: /interview-by-key/:key returns questions as string[]
export interface InterviewData {
  id?: string;
  title: string;
  is_active?: boolean;
  link?: {
    id: string;
    unique_key: string;
    created_at: string;
  };
  questions: string[];
}

interface UsePublicInterviewResult {
  interviewData: InterviewData | null;
  isLoading: boolean;
  error: Error | null;
  activateInterview: (interviewId: string) => Promise<boolean>;
  fetchInterviewByKey: (key: string) => Promise<InterviewData | null>;
  fetchSignedUrlByKey: (key: string, interviewId: string) => Promise<string>;
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

export function usePublicInterview(): UsePublicInterviewResult {
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Activate an interview by ID
   * PUT /interview/:id/activate
   */
  const activateInterview = useCallback(async (interviewId: string): Promise<boolean> => {
    console.log("[usePublicInterview] Activating interview:", interviewId);

    try {
      await callApi(API_ROUTES.activateInterview(interviewId), {
        method: "PUT",
      });
      console.log("[usePublicInterview] Interview activated successfully");
      return true;
    } catch (err) {
      // If already active or other non-critical error, log but don't fail
      console.warn("[usePublicInterview] Activation warning:", err);
      // Still return true as the interview might already be active
      return true;
    }
  }, []);

  /**
   * Fetch interview data by unique key
   * POST /interview-by-key/:key
   */
  const fetchInterviewByKey = useCallback(async (key: string): Promise<InterviewData | null> => {
    console.log("[usePublicInterview] Fetching interview by key:", key);
    setIsLoading(true);
    setError(null);

    try {
      const data = await callApi<InterviewData>(API_ROUTES.interviewByKey(key), {
        method: "GET",
      });
      console.log("[usePublicInterview] Interview data received:", {
        id: data.id,
        title: data.title,
        questionsCount: data.questions?.length || 0,
      });
      setInterviewData(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch interview");
      console.error("[usePublicInterview] Error fetching interview:", error);
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch signed URL for Interview Host agent using key and interview ID
   * GET /elevenlabs/signed-url/key/:key/interview-id/:interviewID
   */
  const fetchSignedUrlByKey = useCallback(async (key: string, interviewId: string): Promise<string> => {
    console.log("[usePublicInterview] Fetching signed URL for key:", key, "interviewId:", interviewId);

    try {
      const data = await callApi<string | Record<string, unknown>>(
        API_ROUTES.signedUrlByKey(key, interviewId)
      );
      const url = parseSignedUrlResponse(data);
      console.log("[usePublicInterview] Signed URL received");
      return url;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch signed URL");
      console.error("[usePublicInterview] Error fetching signed URL:", error);
      throw error;
    }
  }, []);

  return {
    interviewData,
    isLoading,
    error,
    activateInterview,
    fetchInterviewByKey,
    fetchSignedUrlByKey,
  };
}
