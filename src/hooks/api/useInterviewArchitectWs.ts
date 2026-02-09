import { useState, useEffect, useRef, useCallback } from "react";
import { BACKEND_BASE_URL } from "@/config";

interface UseInterviewArchitectWsResult {
  questionsFromWs: string[];
  isConnected: boolean;
  lastMessage: unknown | null;
  error: Error | null;
  connect: () => void;
  disconnect: () => void;
}

/**
 * WebSocket hook for Interview Architect real-time question streaming.
 * Connects to backend WS channel and receives suggested questions.
 *
 * @param roomId - Room ID that must match the ConversationId passed to ElevenLabs
 * @param enabled - Whether to automatically connect when roomId is available
 */
export function useInterviewArchitectWs(
  roomId: string | null,
  enabled: boolean = true
): UseInterviewArchitectWsResult {
  const [questionsFromWs, setQuestionsFromWs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<unknown | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptRef = useRef(0);

  // Track seen questions to avoid duplicates on reconnect/repeated payload
  const seenQuestionsRef = useRef<Set<string>>(new Set());

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      console.log("[InterviewArchitectWs] Closing WebSocket connection");
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
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

    // Build WebSocket URL
    const wsProtocol = BACKEND_BASE_URL.startsWith("https") ? "wss" : "ws";
    const wsHost = BACKEND_BASE_URL.replace(/^https?:\/\//, "");
    const wsUrl = `${wsProtocol}://${wsHost}/ws?room_id=${encodeURIComponent(roomId)}`;

    console.log("[InterviewArchitectWs] Connecting to:", wsUrl);
    console.log("[InterviewArchitectWs] Room ID:", roomId);

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
        console.log("[InterviewArchitectWs] Message received:", event.data);

        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);

          // Handle questions payload: { questions: ["q1", "q2"] }
          if (message.questions && Array.isArray(message.questions)) {
            console.log("[InterviewArchitectWs] Questions received:", message.questions.length);

            // Filter out already seen questions to avoid duplicates
            const newQuestions: string[] = [];
            for (const q of message.questions) {
              if (typeof q === "string" && q.trim() && !seenQuestionsRef.current.has(q)) {
                seenQuestionsRef.current.add(q);
                newQuestions.push(q);
              }
            }

            if (newQuestions.length > 0) {
              console.log("[InterviewArchitectWs] New unique questions:", newQuestions.length);
              setQuestionsFromWs((prev) => {
                const updated = [...prev, ...newQuestions];
                console.log("[InterviewArchitectWs] Total questions now:", updated.length);
                return updated;
              });
            } else {
              console.log("[InterviewArchitectWs] No new questions (all duplicates)");
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
      seenQuestionsRef.current.clear();
    }
  }, [roomId]);

  return {
    questionsFromWs,
    isConnected,
    lastMessage,
    error,
    connect,
    disconnect,
  };
}
