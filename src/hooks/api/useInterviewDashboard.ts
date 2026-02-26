import { useState, useCallback, useEffect, useRef } from "react";
import { callApi } from "@/lib/api";
import { API_ROUTES } from "@/lib/apiRoutes";

// ─────────────────────────────────────────────────────────────
// Section data types for global_dashboard.sections
// ─────────────────────────────────────────────────────────────

export interface SummaryData {
  text: string;
  overall_score?: number;
  overall_status?: string;
}

export interface WordCloudItem {
  word: string;
  weight: number;
}

export interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  highlights?: string[];
}

export interface CriteriaBenchmark {
  criteria: string;
  score: number;
  max?: number;
  percentile?: number;
}

export interface SkillRadarItem {
  skill: string;
  average: number;
  benchmark?: number;
}

export interface RecurringTheme {
  theme: string;
  weight: number;
  description?: string;
}

export interface RedFlag {
  issue: string;
  severity: "high" | "medium" | "low";
  occurrences: number;
}

export interface KeyIdea {
  text: string;
  priority?: number;
}

export interface TopQuote {
  text: string;
  participant?: string;
}

export interface DynamicInsight {
  title: string;
  content: string;
  type?: string;
}

// ─────────────────────────────────────────────────────────────
// Section type union
// ─────────────────────────────────────────────────────────────

export type SectionType =
  | "summary"
  | "word_cloud"
  | "stats_cards"
  | "leaderboard"
  | "criteria_benchmarks"
  | "skills_radar"
  | "recurring_themes"
  | "red_flags"
  | "key_ideas"
  | "top_quotes"
  | "dynamic_insights"
  | "distribution_chart";

export interface DashboardSection {
  type: SectionType;
  data: unknown;
}

export interface GlobalDashboard {
  sections: DashboardSection[];
}

export interface AnalysisBlueprint {
  interview_context?: string;
  dashboard_structure?: unknown;
  analysis_instructions?: string;
}

// ─────────────────────────────────────────────────────────────
// Interview with dashboard data
// ─────────────────────────────────────────────────────────────

export interface InterviewWithDashboard {
  id: string;
  title: string;
  is_active: boolean;
  completed_count: number;
  created_at?: string;
  link: {
    id: string;
    unique_key: string;
    created_at: string;
  } | null;
  questions: number;
  analysis_blueprint?: AnalysisBlueprint;
  global_dashboard?: GlobalDashboard;
}

interface CompletedInterviewsResponse {
  data: InterviewWithDashboard[];
  total: number;
  limit: number;
  offset: number;
}

// ─────────────────────────────────────────────────────────────
// Hook options and result
// ─────────────────────────────────────────────────────────────

interface UseInterviewDashboardOptions {
  interviewId: string | undefined;
  enabled?: boolean;
}

export interface InterviewDashboardData {
  id: string;
  title: string;
  completed_count: number;
  created_at?: string;
  sections: DashboardSection[];
}

interface UseInterviewDashboardResult {
  data: InterviewDashboardData | null;
  isLoading: boolean;
  error: Error | null;
  notFound: boolean;
  refetch: () => Promise<void>;
}

// ─────────────────────────────────────────────────────────────
// Hook implementation
// ─────────────────────────────────────────────────────────────

export function useInterviewDashboard(
  options: UseInterviewDashboardOptions
): UseInterviewDashboardResult {
  const { interviewId, enabled = true } = options;

  const [data, setData] = useState<InterviewDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [notFound, setNotFound] = useState(false);

  const prevInterviewIdRef = useRef<string | undefined>(undefined);

  const fetchDashboard = useCallback(async () => {
    if (!interviewId) return;

    setIsLoading(true);
    setError(null);
    setNotFound(false);

    try {
      // Fetch all completed interviews
      const response = await callApi<CompletedInterviewsResponse>(
        API_ROUTES.completedInterviewsList({ limit: 1000, offset: 0 })
      );

      const interviews = Array.isArray(response?.data) ? response.data : [];

      // Find the interview by ID
      const interview = interviews.find((i) => i.id === interviewId);

      if (!interview) {
        setNotFound(true);
        setData(null);
        return;
      }

      // Extract dashboard data
      const dashboardData: InterviewDashboardData = {
        id: interview.id,
        title: interview.title,
        completed_count: interview.completed_count,
        created_at: interview.created_at ?? interview.link?.created_at,
        sections: interview.global_dashboard?.sections ?? [],
      };

      setData(dashboardData);
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Failed to fetch interview dashboard");
      setError(error);
      console.error("[useInterviewDashboard] Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [interviewId]);

  useEffect(() => {
    const interviewChanged = prevInterviewIdRef.current !== interviewId;
    if (interviewChanged) {
      setData(null);
      setError(null);
      setNotFound(false);
      prevInterviewIdRef.current = interviewId;
    }

    if (!enabled || !interviewId) {
      return;
    }

    let cancelled = false;

    const doFetch = async () => {
      setIsLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const response = await callApi<CompletedInterviewsResponse>(
          API_ROUTES.completedInterviewsList({ limit: 1000, offset: 0 })
        );

        if (cancelled) return;

        const interviews = Array.isArray(response?.data) ? response.data : [];
        const interview = interviews.find((i) => i.id === interviewId);

        if (!interview) {
          setNotFound(true);
          setData(null);
          return;
        }

        const dashboardData: InterviewDashboardData = {
          id: interview.id,
          title: interview.title,
          completed_count: interview.completed_count,
          created_at: interview.created_at ?? interview.link?.created_at,
          sections: interview.global_dashboard?.sections ?? [],
        };

        setData(dashboardData);
      } catch (err) {
        if (cancelled) return;
        const error =
          err instanceof Error
            ? err
            : new Error("Failed to fetch interview dashboard");
        setError(error);
        console.error("[useInterviewDashboard] Error:", error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    doFetch();

    return () => {
      cancelled = true;
    };
  }, [enabled, interviewId]);

  return {
    data,
    isLoading,
    error,
    notFound,
    refetch: fetchDashboard,
  };
}

// ─────────────────────────────────────────────────────────────
// Type guards for section data
// ─────────────────────────────────────────────────────────────

export function isSummaryData(data: unknown): data is SummaryData {
  return typeof data === "object" && data !== null && "text" in data;
}

export function isWordCloudData(data: unknown): data is WordCloudItem[] {
  return Array.isArray(data) && data.every((item) => "word" in item && "weight" in item);
}

export function isStatsCardsData(data: unknown): data is StatCard[] {
  return Array.isArray(data) && data.every((item) => "label" in item && "value" in item);
}

export function isLeaderboardData(data: unknown): data is LeaderboardEntry[] {
  return Array.isArray(data) && data.every((item) => "rank" in item && "name" in item && "score" in item);
}

export function isCriteriaBenchmarksData(data: unknown): data is CriteriaBenchmark[] {
  return Array.isArray(data) && data.every((item) => "criteria" in item && "score" in item);
}

export function isSkillsRadarData(data: unknown): data is SkillRadarItem[] {
  return Array.isArray(data) && data.every((item) => "skill" in item && "average" in item);
}

export function isRecurringThemesData(data: unknown): data is RecurringTheme[] {
  return Array.isArray(data) && data.every((item) => "theme" in item && "weight" in item);
}

export function isRedFlagsData(data: unknown): data is RedFlag[] {
  return Array.isArray(data) && data.every((item) => "issue" in item && "severity" in item);
}

export function isKeyIdeasData(data: unknown): data is (string | KeyIdea)[] {
  return Array.isArray(data);
}

export function isTopQuotesData(data: unknown): data is (string | TopQuote)[] {
  return Array.isArray(data);
}

export function isDynamicInsightsData(data: unknown): data is DynamicInsight[] {
  return Array.isArray(data) && data.every((item) => "title" in item && "content" in item);
}
