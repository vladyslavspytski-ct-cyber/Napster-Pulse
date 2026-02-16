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

          console.log("[InterviewArchitectWs] Parsed message shape:", {
            type: message.type,
            hasQuestions: "questions" in message,
            questionsIsArray: Array.isArray(message.questions),
            questionsSample: message.questions?.[0],
          });

          // Handle apply_template message: { type: "apply_template", template_id: "<ID>" }
          if (message.type === "apply_template" && message.template_id) {
            console.log("[InterviewArchitectWs] apply_template received:", message.template_id);
            setApplyTemplateEvent({
              templateId: message.template_id,
              timestamp: Date.now(),
            });
            return; // Don't process as questions
          }

          // Handle questions payload: { questions: [{ id: string, question: string }] }
          if (message.questions && Array.isArray(message.questions)) {
            console.log("[InterviewArchitectWs] Questions received:", message.questions.length);

            // Parse questions - handle both new structured format and legacy string format
            const parsedQuestions: ActualQuestion[] = [];

            for (const q of message.questions) {
              // New structured format: { id: string, question: string }
              if (typeof q === "object" && q !== null && typeof q.id === "string" && typeof q.question === "string") {
                if (!seenQuestionIdsRef.current.has(q.id)) {
                  seenQuestionIdsRef.current.add(q.id);
                  parsedQuestions.push({ id: q.id, question: q.question });
                }
              }
              // Legacy string format fallback (for backwards compatibility)
              else if (typeof q === "string" && q.trim()) {
                const legacyId = `legacy-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
                if (!seenQuestionIdsRef.current.has(q)) {
                  seenQuestionIdsRef.current.add(q);
                  parsedQuestions.push({ id: legacyId, question: q });
                  console.log("[InterviewArchitectWs] WARNING: Received legacy string format, converted to structured:", q);
                }
              } else {
                console.log("[InterviewArchitectWs] Unknown question format, skipping:", q);
              }
            }

            if (parsedQuestions.length > 0) {
              console.log("[InterviewArchitectWs] New unique questions:", parsedQuestions.length);
              setQuestionsFromWs((prev) => {
                const updated = [...prev, ...parsedQuestions];
                console.log("[InterviewArchitectWs] Total questions now:", updated.length);
                return updated;
              });
            } else {
              console.log("[InterviewArchitectWs] No new questions (all duplicates or invalid)");
            }
          }
        } catch (err) {
          console.error("[InterviewArchitectWs] Failed to parse message:", err);
        }
      };
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
