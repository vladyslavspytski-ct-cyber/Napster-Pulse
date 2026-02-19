import { useCallback, useRef } from "react";

/**
 * Draft structure stored in sessionStorage
 */
export interface InterviewDraft {
  conversationId: string;
  templateId: string | null;
  title: string;
  questions: Array<{
    id: string;
    text: string;
    phase: string;
  }>;
  interviewContext: {
    type?: string;
    goal?: string;
  };
  updatedAt: number;
}

const STORAGE_KEY_PREFIX = "interview_draft_";
const DRAFT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Standalone function to clear all interview drafts from sessionStorage.
 * Can be called from non-React contexts (e.g., logout handler).
 */
export function clearAllInterviewDrafts(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(STORAGE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
    console.log("[Draft] Cleared all drafts on logout:", keysToRemove.length);
  } catch (err) {
    console.error("[Draft] Failed to clear all drafts:", err);
  }
}

/**
 * Hook for managing interview draft persistence in sessionStorage
 * Provides autosave and restore functionality to prevent data loss on reload
 */
export function useInterviewDraft() {
  // Debounce ref for autosave
  const saveDebounceRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Get storage key for a conversation
   */
  const getStorageKey = useCallback((conversationId: string): string => {
    return `${STORAGE_KEY_PREFIX}${conversationId}`;
  }, []);

  /**
   * Save draft to sessionStorage
   */
  const saveDraft = useCallback((draft: InterviewDraft): void => {
    try {
      const key = getStorageKey(draft.conversationId);
      const data = JSON.stringify(draft);
      sessionStorage.setItem(key, data);
      console.log("[Draft] Saved | conv:", draft.conversationId, "| questions:", draft.questions.length);
    } catch (err) {
      console.error("[Draft] Failed to save:", err);
    }
  }, [getStorageKey]);

  /**
   * Debounced save - prevents excessive writes on rapid changes
   */
  const debouncedSaveDraft = useCallback((draft: InterviewDraft, delayMs = 500): void => {
    if (saveDebounceRef.current) {
      clearTimeout(saveDebounceRef.current);
    }
    saveDebounceRef.current = setTimeout(() => {
      saveDraft(draft);
    }, delayMs);
  }, [saveDraft]);

  /**
   * Load draft from sessionStorage
   * Returns null if not found or invalid
   */
  const loadDraft = useCallback((conversationId: string): InterviewDraft | null => {
    try {
      const key = getStorageKey(conversationId);
      const data = sessionStorage.getItem(key);

      if (!data) {
        console.log("[Draft] Not found for conv:", conversationId);
        return null;
      }

      const draft = JSON.parse(data) as InterviewDraft;

      // Validate draft structure
      if (!draft.conversationId || !Array.isArray(draft.questions)) {
        console.warn("[Draft] Invalid structure, ignoring");
        return null;
      }

      // Check TTL
      const age = Date.now() - draft.updatedAt;
      if (age > DRAFT_TTL_MS) {
        console.log("[Draft] Expired (age:", Math.round(age / 1000 / 60), "min), removing");
        sessionStorage.removeItem(key);
        return null;
      }

      console.log("[Draft] Loaded | conv:", conversationId, "| questions:", draft.questions.length, "| age:", Math.round(age / 1000), "s");
      return draft;
    } catch (err) {
      console.error("[Draft] Failed to load:", err);
      return null;
    }
  }, [getStorageKey]);

  /**
   * Clear draft from storage
   */
  const clearDraft = useCallback((conversationId: string): void => {
    try {
      const key = getStorageKey(conversationId);
      sessionStorage.removeItem(key);
      console.log("[Draft] Cleared | conv:", conversationId);
    } catch (err) {
      console.error("[Draft] Failed to clear:", err);
    }
  }, [getStorageKey]);

  /**
   * Clear all drafts (cleanup)
   */
  const clearAllDrafts = useCallback((): void => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(STORAGE_KEY_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
      console.log("[Draft] Cleared all drafts:", keysToRemove.length);
    } catch (err) {
      console.error("[Draft] Failed to clear all:", err);
    }
  }, []);

  /**
   * Cancel any pending save
   */
  const cancelPendingSave = useCallback((): void => {
    if (saveDebounceRef.current) {
      clearTimeout(saveDebounceRef.current);
      saveDebounceRef.current = null;
    }
  }, []);

  return {
    saveDraft,
    debouncedSaveDraft,
    loadDraft,
    clearDraft,
    clearAllDrafts,
    cancelPendingSave,
  };
}
