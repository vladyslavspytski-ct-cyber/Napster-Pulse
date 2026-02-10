import { useState, useEffect, useCallback } from "react";
import { callApi } from "@/lib/api";
import { API_ROUTES } from "@/lib/apiRoutes";

/**
 * Template question from backend
 */
export interface TemplateQuestion {
  id: string;
  template_id: string;
  text: string;
  order: number;
}

/**
 * Template from backend GET /templates
 */
export interface Template {
  id: string;
  title: string;
  scenario: string;
  seq: number;
  questions: TemplateQuestion[];
}

interface UseTemplatesResult {
  templates: Template[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch interview templates from GET /templates
 */
export function useTemplates(): UseTemplatesResult {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("[useTemplates] Fetching templates from", API_ROUTES.templates);
      const response = await callApi<Template[]>(API_ROUTES.templates);

      // Sort templates by seq
      const sorted = [...response].sort((a, b) => a.seq - b.seq);

      console.log("[useTemplates] Loaded", sorted.length, "templates");
      setTemplates(sorted);
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Failed to fetch templates");
      setError(e);
      console.error("[useTemplates] Error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    templates,
    isLoading,
    error,
    refetch,
  };
}
