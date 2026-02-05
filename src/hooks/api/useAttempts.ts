import { useState, useCallback, useEffect, useRef } from "react";
import { callApi } from "@/lib/api";
import { API_ROUTES } from "@/lib/apiRoutes";

export interface DataCollectionResult {
  data_collection_id: string;
  value: string;
}

export interface AttemptAnalysis {
  data_collection_results_list: DataCollectionResult[];
}

export interface Attempt {
  id: string;
  interview_id: string;
  status: string;
  participant_first_name: string;
  participant_last_name: string;
  participant_email: string;
  started_at: string;
  transcript_summary: string;
  analysis: AttemptAnalysis | null;
}

export interface SentimentStats {
  positive: number;
  negative: number;
  neutral: number;
  positive_percent: number;
  negative_percent: number;
  neutral_percent: number;
}

interface AttemptsResponse {
  data: Attempt[];
  total: number;
  limit: number;
  offset: number;
  sentiment_stats?: SentimentStats;
}

interface UseAttemptsOptions {
  interviewId: string | undefined;
  limit?: number;
  offset?: number;
  search?: string;
  sentiment?: string;
  enabled?: boolean;
}

interface UseAttemptsResult {
  attempts: Attempt[];
  total: number;
  sentimentStats: SentimentStats | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAttempts(options: UseAttemptsOptions): UseAttemptsResult {
  const { interviewId, limit = 10, offset = 0, search = "", sentiment = "all", enabled = true } = options;

  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [total, setTotal] = useState(0);
  const [sentimentStats, setSentimentStats] = useState<SentimentStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Track previous interviewId to detect changes
  const prevInterviewIdRef = useRef<string | undefined>(undefined);

  // Fetch attempts when dependencies change
  useEffect(() => {
    // Clear previous data when interview changes
    const interviewChanged = prevInterviewIdRef.current !== interviewId;
    if (interviewChanged) {
      setAttempts([]);
      setTotal(0);
      setSentimentStats(null);
      setError(null);
      prevInterviewIdRef.current = interviewId;
    }

    // Don't fetch if disabled or no interviewId
    if (!enabled || !interviewId) {
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await callApi<AttemptsResponse>(
          API_ROUTES.interviewAttempts(interviewId, { limit, offset, search, sentiment }),
        );

        if (!cancelled) {
          // Defensive: ensure data is always an array and total is always a number
          setAttempts(Array.isArray(response?.data) ? response.data : []);
          setTotal(typeof response?.total === "number" ? response.total : 0);
          setSentimentStats(response?.sentiment_stats ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          const error = err instanceof Error ? err : new Error("Failed to fetch attempts");
          setError(error);
          console.error("[useAttempts] Error:", error);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [enabled, interviewId, limit, offset, search, sentiment]);

  // Refetch function for manual refresh
  const refetch = useCallback(async () => {
    if (!interviewId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await callApi<AttemptsResponse>(
        API_ROUTES.interviewAttempts(interviewId, { limit, offset, search, sentiment }),
      );
      setAttempts(Array.isArray(response?.data) ? response.data : []);
      setTotal(typeof response?.total === "number" ? response.total : 0);
      setSentimentStats(response?.sentiment_stats ?? null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch attempts");
      setError(error);
      console.error("[useAttempts] Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [interviewId, limit, offset, search, sentiment]);

  return {
    attempts,
    total,
    sentimentStats,
    isLoading,
    error,
    refetch,
  };
}

// Helper to extract sentiment label from analysis
export function getSentimentLabel(
  analysis: AttemptAnalysis | null,
): "positive" | "neutral" | "negative" {
  if (!analysis?.data_collection_results_list) return "neutral";

  const sentimentResult = analysis.data_collection_results_list.find(
    (result) => result.data_collection_id === "sentiment_label",
  );

  if (!sentimentResult) return "neutral";

  const value = sentimentResult.value?.toLowerCase();
  if (value === "positive") return "positive";
  if (value === "negative") return "negative";
  return "neutral";
}
