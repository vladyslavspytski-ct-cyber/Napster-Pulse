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

/**
 * Type of the last WS event that modified questions
 * - "offer": questions were ADDED (questions_offer)
 * - "update": questions were REPLACED with full list (questions_update)
 * - "delete": questions were REPLACED with remaining list (questions_delete)
 */
export type WsEventType = "offer" | "update" | "delete" | null;

/**
 * Introduction source tracking
 * - "agent": Introduction came from WebSocket (agent generated)
 * - "generated": Introduction came from POST /interview/generate-introduction
 * - null: No introduction yet
 */
export type IntroductionSource = "agent" | "generated" | null;

interface UseInterviewArchitectWsResult {
  questionsFromWs: ActualQuestion[];
  isConnected: boolean;
  lastMessage: unknown | null;
  error: Error | null;
  /** Type of the last WS event that modified questions - use this to decide MERGE vs REPLACE */
  lastWsEventType: WsEventType;
  /** Event triggered when apply_template WS message is received */
  applyTemplateEvent: ApplyTemplateEvent | null;
  /** Clear the applyTemplateEvent after handling */
  clearApplyTemplateEvent: () => void;
  /** Introduction text from agent (via WebSocket) */
  introductionFromAgent: string | null;
  /** Clear the agent introduction */
  clearIntroductionFromAgent: () => void;
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
  const [lastWsEventType, setLastWsEventType] = useState<WsEventType>(null);
  const [introductionFromAgent, setIntroductionFromAgent] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptRef = useRef(0);

  // Track seen question IDs to avoid duplicates on reconnect/repeated payload
  const seenQuestionIdsRef = useRef<Set<string>>(new Set());
  // Track seen question texts (normalized) for legacy string[] format dedup
  const seenQuestionTextsRef = useRef<Set<string>>(new Set());

  // Helper: normalize text for dedup comparison
  const normalizeText = (text: string): string => {
    return text.trim().toLowerCase().replace(/\s+/g, " ");
  };

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

  const clearIntroductionFromAgent = useCallback(() => {
    setIntroductionFromAgent(null);
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

            case "introduction_update":
              handleIntroductionUpdate(msgData);
              break;

            case "questions_offer":
              // ADD new questions (with dedup)
              handleQuestionsOffer(msgData);
              break;

            case "questions_update":
              // REPLACE entire list (agent modified questions)
              handleQuestionsUpdate(msgData);
              break;

            case "questions_delete":
              // REPLACE with remaining list
              handleQuestionsDelete(msgData);
              break;

            default:
              // Legacy fallback: check for root-level questions array (backwards compat)
              if (message.questions && Array.isArray(message.questions)) {
                console.log("[WS] Legacy format detected (root-level questions)");
                handleQuestionsOffer(message.questions);
              } else if (msgType) {
                console.log("[WS] Unknown message type:", msgType);
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

      // === Handler: introduction_update ===
      function handleIntroductionUpdate(data: unknown) {
        // Support: data as string directly, or data.introduction as string
        let introduction: string | null = null;

        if (typeof data === "string" && data.trim()) {
          introduction = data.trim();
        } else if (typeof data === "object" && data !== null) {
          const obj = data as Record<string, unknown>;
          if (typeof obj.introduction === "string") {
            introduction = obj.introduction.trim();
          }
        }

        if (!introduction) {
          console.log("[InterviewArchitectWs] introduction_update: No introduction found in data:", data);
          return;
        }

        console.log("[InterviewArchitectWs] introduction_update | length:", introduction.length, "chars");
        setIntroductionFromAgent(introduction);
      }

      // === Helper: Parse questions array ===
      function parseQuestionsArray(questionsArray: unknown[], eventType: string): ActualQuestion[] {
        const parsedQuestions: ActualQuestion[] = [];

        for (const q of questionsArray) {
          // Structured format: { id: string, question: string }
          if (typeof q === "object" && q !== null && typeof (q as Record<string, unknown>).id === "string" && typeof (q as Record<string, unknown>).question === "string") {
            const qObj = q as { id: string; question: string };
            parsedQuestions.push({ id: qObj.id, question: qObj.question });
          }
          // Legacy string format fallback
          else if (typeof q === "string" && q.trim()) {
            const legacyId = `legacy-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
            parsedQuestions.push({ id: legacyId, question: q });
            console.log(`[WS] ${eventType}: WARNING - legacy string format:`, q.substring(0, 50));
          } else {
            console.log(`[WS] ${eventType}: Unknown question format, skipping:`, q);
          }
        }

        return parsedQuestions;
      }

      // === Handler: questions_offer ===
      // ADD new questions to existing (with dedup by ID AND text)
      function handleQuestionsOffer(data: unknown) {
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
          console.log("[WS] questions_offer: No questions in data");
          return;
        }

        console.log("[WS] questions_offer | incoming:", questionsArray.length);

        // Parse questions
        const allParsed = parseQuestionsArray(questionsArray, "questions_offer");

        // Filter out duplicates by ID OR by normalized text
        // This handles legacy string[] format where IDs are generated on the fly
        let skippedById = 0;
        let skippedByText = 0;

        const newQuestions = allParsed.filter(q => {
          // Check ID first
          if (seenQuestionIdsRef.current.has(q.id)) {
            skippedById++;
            return false;
          }
          // Check normalized text (handles legacy format duplicates)
          const normalizedText = normalizeText(q.question);
          if (seenQuestionTextsRef.current.has(normalizedText)) {
            skippedByText++;
            return false;
          }
          return true;
        });

        const totalSkipped = skippedById + skippedByText;
        if (totalSkipped > 0) {
          console.log(`[WS] questions_offer | dedup: skipped ${totalSkipped} (byId: ${skippedById}, byText: ${skippedByText})`);
        }

        if (newQuestions.length === 0) {
          console.log("[WS] questions_offer: All questions are duplicates, skipping");
          return;
        }

        // Add new IDs and texts to seen sets
        newQuestions.forEach(q => {
          seenQuestionIdsRef.current.add(q.id);
          seenQuestionTextsRef.current.add(normalizeText(q.question));
        });

        console.log("[WS] questions_offer | adding:", newQuestions.length, "new questions");

        setQuestionsFromWs((prev) => {
          const updated = [...prev, ...newQuestions];
          console.log("[WS] questions_offer | total now:", updated.length);
          return updated;
        });

        // Mark event type for UI to know this was an ADD operation
        setLastWsEventType("offer");
      }

      // === Handler: questions_update ===
      // REPLACE entire list (agent modified questions)
      function handleQuestionsUpdate(data: unknown) {
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

        console.log("[WS] questions_update | incoming:", questionsArray.length);

        // Parse all questions
        const parsedQuestions = parseQuestionsArray(questionsArray, "questions_update");

        // Get previous count for logging
        const prevCount = seenQuestionIdsRef.current.size;

        // Rebuild seen sets from new list (REPLACE semantics)
        seenQuestionIdsRef.current = new Set(parsedQuestions.map(q => q.id));
        seenQuestionTextsRef.current = new Set(parsedQuestions.map(q => normalizeText(q.question)));

        // Replace questions list entirely
        setQuestionsFromWs(parsedQuestions);

        console.log(`[WS] questions_update | prev: ${prevCount} | new: ${parsedQuestions.length}`);
        if (parsedQuestions.length > 0) {
          console.log(`[WS] questions_update | IDs: [${parsedQuestions.map(q => q.id).slice(0, 3).join(", ")}${parsedQuestions.length > 3 ? "..." : ""}]`);
        }

        // Mark event type for UI to know this was a REPLACE operation
        setLastWsEventType("update");
      }

      // === Handler: questions_delete ===
      // NOTE: Backend sends the REMAINING list after deletion, not IDs to delete
      function handleQuestionsDelete(data: unknown) {
        // Support: data as array directly, or data.questions as array
        let remainingQuestionsArray: unknown[] = [];

        if (Array.isArray(data)) {
          remainingQuestionsArray = data;
        } else if (typeof data === "object" && data !== null) {
          const obj = data as Record<string, unknown>;
          if (Array.isArray(obj.questions)) {
            remainingQuestionsArray = obj.questions;
          }
        }

        console.log("[WS] questions_delete | incoming remaining count:", remainingQuestionsArray.length);

        // Parse questions from the remaining list
        const parsedQuestions: ActualQuestion[] = [];
        const newSeenIds = new Set<string>();

        for (const q of remainingQuestionsArray) {
          if (typeof q === "object" && q !== null &&
              typeof (q as Record<string, unknown>).id === "string" &&
              typeof (q as Record<string, unknown>).question === "string") {
            const qObj = q as { id: string; question: string };
            parsedQuestions.push({ id: qObj.id, question: qObj.question });
            newSeenIds.add(qObj.id);
          } else {
            console.log("[WS] questions_delete | skipping invalid question format:", q);
          }
        }

        // Get previous count for logging
        const prevCount = seenQuestionIdsRef.current.size;

        // Replace seen sets with new data (REPLACE semantics)
        seenQuestionIdsRef.current = newSeenIds;
        seenQuestionTextsRef.current = new Set(parsedQuestions.map(q => normalizeText(q.question)));

        // Replace questions list entirely
        setQuestionsFromWs(parsedQuestions);

        console.log(`[WS] questions_delete | prev: ${prevCount} | new: ${parsedQuestions.length} | removed: ${prevCount - parsedQuestions.length}`);
        console.log(`[WS] questions_delete | new IDs: [${parsedQuestions.map(q => q.id).join(", ")}]`);

        // Mark event type for UI to know this was a REPLACE operation (remaining list)
        setLastWsEventType("delete");
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

    // GUARD: Never sync empty array - this confuses the agent
    if (questions.length === 0) {
      console.log("[InterviewArchitectWs] syncQuestions: SKIP | reason: empty array | roomId:", currentRoomId);
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
      seenQuestionTextsRef.current.clear();
      setLastWsEventType(null);
    }
  }, [roomId]);

  return {
    questionsFromWs,
    isConnected,
    lastMessage,
    error,
    lastWsEventType,
    applyTemplateEvent,
    clearApplyTemplateEvent,
    introductionFromAgent,
    clearIntroductionFromAgent,
    connect,
    disconnect,
    syncQuestions,
  };
}
