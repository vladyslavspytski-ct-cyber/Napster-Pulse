import { useState, useEffect, useRef, useCallback } from "react";
import { BACKEND_BASE_URL } from "@/config";
import { callApi } from "@/lib/api";
import { API_ROUTES } from "@/lib/apiRoutes";

/**
 * Backend question format from /ws/questions
 */
export interface ActualQuestion {
  id: string;
  question: string;
}

/**
 * Event emitted when backend sends apply_template message
 */
export interface ApplyTemplateEvent {
  templateId: string;
  timestamp: number;
}

interface UseInterviewArchitectWsResult {
  questionsFromWs: ActualQuestion[];
  isConnected: boolean;
  lastMessage: unknown | null;
  error: Error | null;
  /** Event triggered when apply_template WS message is received */
  applyTemplateEvent: ApplyTemplateEvent | null;
  /** Clear the applyTemplateEvent after handling */
  clearApplyTemplateEvent: () => void;
  connect: () => void;
  disconnect: () => void;
  syncQuestions: (questions: ActualQuestion[]) => Promise<void>;
}

/**
 * WebSocket hook for Interview Architect real-time question streaming.
 * Connects to backend WS channel at /ws/questions and receives suggested questions.
 *
 * @param roomId - Room ID that must match the ConversationId passed to ElevenLabs
 * @param enabled - Whether to automatically connect when roomId is available
 */
export function useInterviewArchitectWs(
  roomId: string | null,
  enabled: boolean = true
): UseInterviewArchitectWsResult {
  const [questionsFromWs, setQuestionsFromWs] = useState<ActualQuestion[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<unknown | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [applyTemplateEvent, setApplyTemplateEvent] = useState<ApplyTemplateEvent | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptRef = useRef(0);

  // Track seen question IDs to avoid duplicates on reconnect/repeated payload
  const seenQuestionIdsRef = useRef<Set<string>>(new Set());

  // Store current roomId in ref for sync function
  const roomIdRef = useRef<string | null>(roomId);
  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      console.log("[InterviewArchitectWs] Closing WebSocket connection");
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const clearApplyTemplateEvent = useCallback(() => {
    setApplyTemplateEvent(null);
  }, []);

  const connect = useCallback(() => {
    if (!roomId) {
      console.log("[InterviewArchitectWs] No roomId provided, skipping connection");
      return;
    }

    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close();
    }

    // Build WebSocket URL for /ws endpoint
    const wsProtocol = BACKEND_BASE_URL.startsWith("https") ? "wss" : "ws";
    const wsHost = BACKEND_BASE_URL.replace(/^https?:\/\//, "");
    const wsUrl = `${wsProtocol}://${wsHost}/ws?room_id=${encodeURIComponent(roomId)}`;

    console.log("[InterviewArchitectWs] Connecting to:", wsUrl);
    console.log("[InterviewArchitectWs] Room ID (must match ConversationId):", roomId);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[InterviewArchitectWs] WebSocket opened successfully");
        setIsConnected(true);
        setError(null);
        reconnectAttemptRef.current = 0;
      };

      ws.onclose = (event) => {
        console.log("[InterviewArchitectWs] WebSocket closed:", event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;
      };

      ws.onerror = (event) => {
        console.error("[InterviewArchitectWs] WebSocket error:", event);
        const err = new Error("WebSocket connection error");
        setError(err);
      };

      ws.onmessage = (event) => {
        console.log("[InterviewArchitectWs] Raw message received:", event.data);

        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);

          // New unified format: { type: string, data: any }
          const msgType = message.type;
          const msgData = message.data;

          console.log("[InterviewArchitectWs] Parsed message:", {
            type: msgType,
            hasData: msgData !== undefined,
            dataType: typeof msgData,
            dataIsArray: Array.isArray(msgData),
            dataSummary: summarizeData(msgData),
          });

          // Route by message type
          switch (msgType) {
            case "apply_template":
              handleApplyTemplate(msgData);
              break;

            case "questions_offer":
            case "questions_update":
              handleQuestionsOfferOrUpdate(msgType, msgData);
              break;

            case "questions_delete":
              handleQuestionsDelete(msgData);
              break;

            default:
              // Legacy fallback: check for root-level questions array (backwards compat)
              if (message.questions && Array.isArray(message.questions)) {
                console.log("[InterviewArchitectWs] Legacy format detected (root-level questions)");
                handleQuestionsOfferOrUpdate("legacy", message.questions);
              } else if (msgType) {
                console.log("[InterviewArchitectWs] Unknown message type:", msgType);
              }
          }
        } catch (err) {
          console.error("[InterviewArchitectWs] Failed to parse message:", err);
        }
      };

      // === Helper: Summarize data for logging ===
      function summarizeData(data: unknown): string {
        if (data === null || data === undefined) return "null/undefined";
        if (typeof data === "string") return `string(${data.length} chars)`;
        if (Array.isArray(data)) return `array(${data.length} items)`;
        if (typeof data === "object") {
          const keys = Object.keys(data);
          return `object(keys: ${keys.slice(0, 5).join(", ")}${keys.length > 5 ? "..." : ""})`;
        }
        return typeof data;
      }

      // === Handler: apply_template ===
      function handleApplyTemplate(data: unknown) {
        // Support: data.template_id (object) or data as string (direct ID)
        let templateId: string | null = null;

        if (typeof data === "string" && data.trim()) {
          templateId = data.trim();
        } else if (typeof data === "object" && data !== null) {
          const obj = data as Record<string, unknown>;
          if (typeof obj.template_id === "string") {
            templateId = obj.template_id;
          }
        }

        if (!templateId) {
          console.error("[InterviewArchitectWs] apply_template: No template_id found in data:", data);
          return;
        }

        console.log("[InterviewArchitectWs] apply_template | template_id:", templateId);
        setApplyTemplateEvent({
          templateId,
          timestamp: Date.now(),
        });
      }

      // === Handler: questions_offer / questions_update ===
      function handleQuestionsOfferOrUpdate(eventType: string, data: unknown) {
        // Support: data.questions (array) or data as array directly
        let questionsArray: unknown[] = [];

        if (Array.isArray(data)) {
          questionsArray = data;
        } else if (typeof data === "object" && data !== null) {
          const obj = data as Record<string, unknown>;
          if (Array.isArray(obj.questions)) {
            questionsArray = obj.questions;
          }
        }

        if (questionsArray.length === 0) {
          console.log(`[InterviewArchitectWs] ${eventType}: No questions in data`);
          return;
        }

        console.log(`[InterviewArchitectWs] ${eventType} | incoming questions:`, questionsArray.length);

        // Parse and dedupe questions
        const parsedQuestions: ActualQuestion[] = [];

        for (const q of questionsArray) {
          // Structured format: { id: string, question: string }
          if (typeof q === "object" && q !== null && typeof (q as Record<string, unknown>).id === "string" && typeof (q as Record<string, unknown>).question === "string") {
            const qObj = q as { id: string; question: string };
            if (!seenQuestionIdsRef.current.has(qObj.id)) {
              seenQuestionIdsRef.current.add(qObj.id);
              parsedQuestions.push({ id: qObj.id, question: qObj.question });
            } else {
              console.log(`[InterviewArchitectWs] ${eventType}: Skipping duplicate id:`, qObj.id);
            }
          }
          // Legacy string format fallback
          else if (typeof q === "string" && q.trim()) {
            const legacyId = `legacy-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
            if (!seenQuestionIdsRef.current.has(q)) {
              seenQuestionIdsRef.current.add(q);
              parsedQuestions.push({ id: legacyId, question: q });
              console.log(`[InterviewArchitectWs] ${eventType}: WARNING - legacy string format:`, q.substring(0, 50));
            }
          } else {
            console.log(`[InterviewArchitectWs] ${eventType}: Unknown question format, skipping:`, q);
          }
        }

        if (parsedQuestions.length > 0) {
          console.log(`[InterviewArchitectWs] ${eventType} | new unique questions:`, parsedQuestions.length);
          setQuestionsFromWs((prev) => {
            const updated = [...prev, ...parsedQuestions];
            console.log(`[InterviewArchitectWs] ${eventType} | total questions now:`, updated.length);
            return updated;
          });
        } else {
          console.log(`[InterviewArchitectWs] ${eventType}: No new questions (all duplicates or invalid)`);
        }
      }

      // === Handler: questions_delete ===
      function handleQuestionsDelete(data: unknown) {
        // Support: data.ids (preferred) or data.questions (fallback with id field)
        let idsToDelete: string[] = [];

        if (typeof data === "object" && data !== null) {
          const obj = data as Record<string, unknown>;

          // Preferred: data.ids array
          if (Array.isArray(obj.ids)) {
            idsToDelete = obj.ids.filter((id): id is string => typeof id === "string");
          }
          // Fallback: data.questions array with id field
          else if (Array.isArray(obj.questions)) {
            idsToDelete = obj.questions
              .map((q) => (typeof q === "object" && q !== null ? (q as Record<string, unknown>).id : null))
              .filter((id): id is string => typeof id === "string");
          }
        }

        if (idsToDelete.length === 0) {
          console.log("[InterviewArchitectWs] questions_delete: No valid IDs found in data:", data);
          return;
        }

        console.log("[InterviewArchitectWs] questions_delete | ids to remove:", idsToDelete.length, idsToDelete);

        // Remove from seen set
        for (const id of idsToDelete) {
          seenQuestionIdsRef.current.delete(id);
        }

        // Remove from questions list
        const idsSet = new Set(idsToDelete);
        setQuestionsFromWs((prev) => {
          const updated = prev.filter((q) => !idsSet.has(q.id));
          console.log("[InterviewArchitectWs] questions_delete | removed:", prev.length - updated.length, "| remaining:", updated.length);
          return updated;
        });
      }
    } catch (err) {
      console.error("[InterviewArchitectWs] Failed to create WebSocket:", err);
      const error = err instanceof Error ? err : new Error("Failed to create WebSocket");
      setError(error);
    }
  }, [roomId]);

  /**
   * Sync questions back to backend via POST /ws/questions?room_id=<roomId>
   * Call this when user edits, deletes, or reorders questions
   */
  const syncQuestions = useCallback(async (questions: ActualQuestion[]): Promise<void> => {
    const currentRoomId = roomIdRef.current;
    if (!currentRoomId) {
      console.log("[InterviewArchitectWs] syncQuestions: No roomId, skipping sync");
      return;
    }

    // Build URL with room_id as query param
    const url = `${API_ROUTES.architectQuestionsSync}?room_id=${encodeURIComponent(currentRoomId)}`;

    // Body contains only questions array
    const payload = {
      questions: questions.map((q) => ({ id: q.id, question: q.question })),
    };

    console.log("[InterviewArchitectWs] POST", url, "| roomId:", currentRoomId, "| questions:", questions.length);

    try {
      const response = await callApi<unknown>(url, {
        method: "POST",
        body: payload as unknown as BodyInit,
      });
      console.log("[InterviewArchitectWs] POST success:", response);
    } catch (err) {
      console.error("[InterviewArchitectWs] POST error:", err);
      // Don't throw - keep UI responsive even if sync fails
    }
  }, []);

  // Auto-connect when roomId changes and enabled
  useEffect(() => {
    if (enabled && roomId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [roomId, enabled, connect, disconnect]);

  // Reset questions when roomId changes
  useEffect(() => {
    if (roomId) {
      setQuestionsFromWs([]);
      seenQuestionIdsRef.current.clear();
    }
  }, [roomId]);

  return {
    questionsFromWs,
    isConnected,
    lastMessage,
    error,
    applyTemplateEvent,
    clearApplyTemplateEvent,
    connect,
    disconnect,
    syncQuestions,
  };
}
