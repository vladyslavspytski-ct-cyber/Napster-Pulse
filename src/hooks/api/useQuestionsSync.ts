import { useCallback, useRef } from "react";
import { callApi } from "@/lib/api";
import { API_ROUTES } from "@/lib/apiRoutes";

/**
 * Question structure for backend sync
 */
export interface SyncQuestion {
  id: string;
  question: string;
}

interface UseQuestionsSyncResult {
  /**
   * Sync questions to backend for a given room/conversation ID
   * @param roomId - The conversation/room ID
   * @param questions - Array of questions to sync
   */
  syncQuestions: (roomId: string, questions: SyncQuestion[]) => Promise<void>;

  /**
   * Debounced sync - delays sync by 300ms to avoid spamming on rapid edits
   * Cancels any pending sync when called again
   */
  debouncedSync: (roomId: string, questions: SyncQuestion[]) => void;

  /**
   * Cancel any pending debounced sync
   */
  cancelPendingSync: () => void;
}

/**
 * Hook for syncing interview questions to the backend
 * Centralizes the POST /ws/questions logic with logging and error handling
 */
export function useQuestionsSync(): UseQuestionsSyncResult {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const syncQuestions = useCallback(
    async (roomId: string, questions: SyncQuestion[]): Promise<void> => {
      // GUARD: Never sync empty array - this confuses the agent
      if (questions.length === 0) {
        console.log("[useQuestionsSync] SKIP | reason: empty array | roomId:", roomId);
        return;
      }

      const url = `${API_ROUTES.architectQuestionsSync}?room_id=${encodeURIComponent(roomId)}`;
      const payload = {
        questions: questions.map((q) => ({ id: q.id, question: q.question })),
      };

      console.log(
        "[useQuestionsSync] POST",
        url,
        "| roomId:",
        roomId,
        "| questions:",
        questions.length
      );

      try {
        await callApi<unknown>(url, {
          method: "POST",
          body: payload as unknown as BodyInit,
        });
        console.log("[useQuestionsSync] POST success");
      } catch (err) {
        console.error("[useQuestionsSync] POST error:", err);
        throw err;
      }
    },
    []
  );

  const debouncedSync = useCallback(
    (roomId: string, questions: SyncQuestion[]) => {
      // Clear any pending sync
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Debounce for 300ms
      debounceRef.current = setTimeout(() => {
        syncQuestions(roomId, questions).catch(() => {
          // Error already logged in syncQuestions
        });
      }, 300);
    },
    [syncQuestions]
  );

  const cancelPendingSync = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  return {
    syncQuestions,
    debouncedSync,
    cancelPendingSync,
  };
}
