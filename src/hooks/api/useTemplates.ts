import { useState, useEffect, useCallback, useMemo } from "react";
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
  category: string;
  subcategory: string;
  emoji: string;
  color: string;
  seq: number;
  questions: TemplateQuestion[];
}

/**
 * Derived category data built from templates
 */
export interface TemplateCategory {
  id: string;
  title: string;
  emoji: string;
  color: string;
  typeCount: number;
  questionCount: number;
  templates: Template[];
}

/**
 * Helper to generate a slug from a string
 */
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Build categories from flat templates list
 * Groups by category field, picks emoji/color from first template (by seq)
 */
export function buildCategoriesFromTemplates(templates: Template[]): TemplateCategory[] {
  const categoryMap = new Map<string, Template[]>();

  // Group templates by category
  for (const template of templates) {
    const cat = template.category || "Other";
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, []);
    }
    categoryMap.get(cat)!.push(template);
  }

  // Build category objects
  const categories: TemplateCategory[] = [];
  for (const [categoryName, categoryTemplates] of categoryMap) {
    // Sort templates by seq to pick first one for emoji/color
    const sorted = [...categoryTemplates].sort((a, b) => a.seq - b.seq);
    const first = sorted[0];

    // Calculate total questions
    const questionCount = sorted.reduce((sum, t) => sum + t.questions.length, 0);

    categories.push({
      id: slugify(categoryName),
      title: categoryName,
      emoji: first.emoji || "📋",
      color: first.color || "#6366f1",
      typeCount: sorted.length,
      questionCount,
      templates: sorted,
    });
  }

  // Sort categories by the minimum seq of their templates
  categories.sort((a, b) => {
    const aMinSeq = Math.min(...a.templates.map((t) => t.seq));
    const bMinSeq = Math.min(...b.templates.map((t) => t.seq));
    return aMinSeq - bMinSeq;
  });

  return categories;
}

interface UseTemplatesOptions {
  /** If false, templates won't be fetched on mount. Use refetch() to load manually. Default: true */
  enabled?: boolean;
}

interface UseTemplatesResult {
  templates: Template[];
  categories: TemplateCategory[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  // Helper functions
  findCategoryById: (id: string) => TemplateCategory | undefined;
  findTemplateById: (id: string) => Template | undefined;
  findCategoryForTemplate: (templateId: string) => TemplateCategory | undefined;
}

/**
 * Hook to fetch interview templates from GET /templates
 * Also builds derived category data for the directory UI
 *
 * @param options.enabled - If false, won't auto-fetch on mount (default: true)
 */
export function useTemplates(options: UseTemplatesOptions = {}): UseTemplatesResult {
  const { enabled = true } = options;
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

  // Fetch on mount (if enabled)
  useEffect(() => {
    if (enabled) {
      refetch();
    }
  }, [enabled, refetch]);

  // Build categories from templates
  const categories = useMemo(() => buildCategoriesFromTemplates(templates), [templates]);

  // Helper: find category by ID
  const findCategoryById = useCallback(
    (id: string): TemplateCategory | undefined => {
      return categories.find((c) => c.id === id);
    },
    [categories]
  );

  // Helper: find template by ID
  const findTemplateById = useCallback(
    (id: string): Template | undefined => {
      return templates.find((t) => t.id === id);
    },
    [templates]
  );

  // Helper: find category that contains a template
  const findCategoryForTemplate = useCallback(
    (templateId: string): TemplateCategory | undefined => {
      return categories.find((c) => c.templates.some((t) => t.id === templateId));
    },
    [categories]
  );

  return {
    templates,
    categories,
    isLoading,
    error,
    refetch,
    findCategoryById,
    findTemplateById,
    findCategoryForTemplate,
  };
}
