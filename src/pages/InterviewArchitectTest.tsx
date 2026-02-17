import { useState, useEffect, useRef, useCallback } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, CheckCircle, LayoutTemplate } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import ArchitectPhaseIndicator, {
  ArchitectPhase,
} from "@/components/interview-architect/ArchitectPhaseIndicator";
import ArchitectAgentCard, {
  AgentState,
} from "@/components/interview-architect/ArchitectAgentCard";
import InterviewContextBadges,
  { InterviewContext } from "@/components/interview-architect/InterviewContextBadges";
import StructuredQuestionCard, {
  StructuredQuestion,
} from "@/components/interview-architect/StructuredQuestionCard";
import ArchitectFinalizeModal from "@/components/interview-architect/ArchitectFinalizeModal";
import {
  useInterviewArchitectWs,
  ActualQuestion,
} from "@/hooks/api/useInterviewArchitectWs";
import { useTemplates, Template } from "@/hooks/api/useTemplates";
import { useQuestionsSync, SyncQuestion } from "@/hooks/api/useQuestionsSync";
import { ElevenLabsConversation } from "@/lib/elevenlabs";
import { useSignedUrl } from "@/hooks/api";

// Mock data by preset (kept unchanged for demo purposes)
const mockDataByPreset: Record<
  string,
  {
    context: InterviewContext;
    prompts: string[];
    questions: StructuredQuestion[];
  }
> = {
  "hr-exit": {
    context: {
      type: "HR Exit Interview",
      goal: "Retention insights",
      duration: "30 min",
      tone: "Supportive",
    },
    prompts: [
      "What's prompting this exit interview? Tell me about the employee.",
      "I see — a 3-year tenure, voluntary departure. Let me design questions that balance honest feedback with relationship preservation.",
      "I've structured a 6-question flow. Feel free to reorder or edit these.",
    ],
    questions: [
      {
        id: "1",
        text: "Before we begin, I want you to know this conversation is confidential. How are you feeling about your transition?",
        phase: "opening",
        rationale:
          "Establishes psychological safety and acknowledges the emotional weight of leaving.",
        sensitivityNote:
          "Some employees may be emotional; give space for processing.",
      },
      {
        id: "2",
        text: "What initially attracted you to this role, and how did your experience compare to those expectations?",
        phase: "warmup",
        rationale:
          "Surfaces the gap between expectations and reality without being confrontational.",
        alternatives: [
          "What drew you to join us originally?",
          "How did the role match what you imagined?",
        ],
      },
      {
        id: "3",
        text: "If you could change one thing about your day-to-day experience here, what would it be?",
        phase: "core",
        rationale:
          "Focuses on actionable, specific feedback rather than vague dissatisfaction.",
        probes: [
          "Can you give me a specific example?",
          "How did that affect your motivation?",
        ],
      },
      {
        id: "4",
        text: "How would you describe your relationship with your direct manager?",
        phase: "core",
        rationale: "Manager relationship is the #1 predictor of retention.",
        sensitivityNote: "Avoid leading questions; let them share freely.",
      },
      {
        id: "5",
        text: "What could we have done differently to keep you on the team?",
        phase: "deepdive",
        rationale:
          "Direct question that often yields the most actionable insight.",
        alternatives: [
          "Was there a specific moment when you decided to leave?",
        ],
      },
      {
        id: "6",
        text: "What advice would you give to your successor?",
        phase: "closing",
        rationale: "Shifts focus to constructive forward-looking perspective.",
      },
    ],
  },
  journalism: {
    context: {
      type: "Journalistic Source",
      goal: "Verify claims",
      duration: "45 min",
      tone: "Trust-building",
    },
    prompts: [
      "This sounds sensitive. Is the source a whistleblower or witness?",
      "High-stakes situation with a whistleblower on deep background. I'll prioritize trust-building and verification.",
      "Here's a structured approach with sensitivity notes for each question.",
    ],
    questions: [
      {
        id: "1",
        text: "Thank you for agreeing to speak with me. Can you start by telling me about your background and how you came to have knowledge of this situation?",
        phase: "opening",
        rationale: "Establishes credibility and context for their knowledge.",
        sensitivityNote:
          "Source may be nervous; reassure about confidentiality.",
      },
      {
        id: "2",
        text: "In your own words, what happened?",
        phase: "warmup",
        rationale:
          "Open-ended prompt allows source to tell their story without leading.",
        probes: ["When did this occur?", "Who else was present?"],
      },
      {
        id: "3",
        text: "Do you have any documentation, emails, or records that support what you've described?",
        phase: "core",
        rationale:
          "Verification is essential; tangible evidence strengthens the story.",
      },
      {
        id: "4",
        text: "Who else can corroborate this account?",
        phase: "core",
        rationale:
          "Multiple sources strengthen credibility and reduce legal risk.",
      },
      {
        id: "5",
        text: "Why are you choosing to share this now?",
        phase: "deepdive",
        rationale: "Helps assess motivation and potential bias.",
        sensitivityNote: "Be empathetic; sources often take significant risk.",
      },
      {
        id: "6",
        text: "Is there anything you're not comfortable with me publishing, or any conditions on how this information is used?",
        phase: "closing",
        rationale: "Clarifies ground rules and protects both parties legally.",
      },
    ],
  },
  education: {
    context: {
      type: "Educational Assessment",
      goal: "Check understanding",
      duration: "10 min",
      tone: "Encouraging",
    },
    prompts: [
      "What subject and grade level? Is this formative or summative?",
      "8th grade photosynthesis, formative check. I'll scaffold from recall to application.",
      "Here's a quick 6-question flow aligned to Bloom's taxonomy.",
    ],
    questions: [
      {
        id: "1",
        text: "Let's start with something easy. Can you tell me what subject we're going to talk about today?",
        phase: "opening",
        rationale: "Confirms topic and eases student into the assessment.",
      },
      {
        id: "2",
        text: "In your own words, what is the main idea of what we learned this week?",
        phase: "warmup",
        rationale:
          "Assesses comprehension at a conceptual level before details.",
        alternatives: ["Can you summarize what we studied?"],
      },
      {
        id: "3",
        text: "Can you give me an example of how this concept works in real life?",
        phase: "core",
        rationale: "Tests application and transfer of knowledge.",
        probes: ["Why does that example fit?", "Can you think of another one?"],
      },
      {
        id: "4",
        text: "What was the most confusing part for you, and how did you work through it?",
        phase: "core",
        rationale: "Assesses metacognition and self-regulation.",
      },
      {
        id: "5",
        text: "If you were the teacher, how would you explain this to someone who doesn't understand it yet?",
        phase: "deepdive",
        rationale: "Teaching others is the highest level of understanding.",
      },
      {
        id: "6",
        text: "What's one thing you want to learn more about related to this topic?",
        phase: "closing",
        rationale: "Fosters curiosity and identifies future learning goals.",
      },
    ],
  },
  "manager-1on1": {
    context: {
      type: "Manager 1:1",
      goal: "Address disengagement",
      duration: "25 min",
      tone: "Caring",
    },
    prompts: [
      "Tell me about the signs of disengagement you're seeing.",
      "Gradual disengagement over a month with a newer report. Could be burnout or role misfit.",
      "I'll structure questions that start with care before addressing concerns.",
    ],
    questions: [
      {
        id: "1",
        text: "How are you doing this week—not just work, but overall?",
        phase: "opening",
        rationale: "Shows genuine care and opens door for personal context.",
      },
      {
        id: "2",
        text: "What's been your biggest win since we last talked?",
        phase: "warmup",
        rationale:
          "Starts positive and builds confidence before harder topics.",
      },
      {
        id: "3",
        text: "What's getting in the way of you doing your best work right now?",
        phase: "core",
        rationale: "Surfaces blockers and frustrations directly.",
        probes: ["Is this a recurring issue?", "What would help?"],
      },
      {
        id: "4",
        text: "How are you feeling about your career trajectory here?",
        phase: "core",
        rationale: "Addresses long-term engagement and growth.",
        sensitivityNote:
          "Employee may not feel safe being honest; create space.",
      },
      {
        id: "5",
        text: "Is there anything I'm doing—or not doing—that's making your job harder?",
        phase: "deepdive",
        rationale:
          "Models vulnerability and invites honest feedback on management.",
      },
      {
        id: "6",
        text: "What's one thing you want to accomplish before our next check-in?",
        phase: "closing",
        rationale: "Creates accountability and a clear action item.",
      },
    ],
  },
};

/**
 * Generate a stable conversationId for the session
 * Used for both backend question sync and ElevenLabs agent binding
 */
function generateConversationId(): string {
  return `conv-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Convert a backend ActualQuestion to a StructuredQuestion object
 * Uses backend-provided ID as stable key
 */
function actualQuestionToStructured(q: ActualQuestion): StructuredQuestion {
  return {
    id: q.id,
    text: q.question,
    phase: "core", // Default phase for WS questions
  };
}

/**
 * Convert StructuredQuestion back to SyncQuestion for backend sync
 */
function structuredToSyncQuestion(q: StructuredQuestion): SyncQuestion {
  return {
    id: q.id,
    question: q.text,
  };
}

const InterviewArchitectTest = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const { fetchSignedUrl } = useSignedUrl(undefined, { enabled: false });

  // Redirect to home if not logged in
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [authLoading, isLoggedIn, navigate]);

  // === Templates state ===
  const [searchParams, setSearchParams] = useSearchParams();
  // Track if we need templates (templateId in URL or apply_template WS event pending)
  const [needsTemplates, setNeedsTemplates] = useState(() => !!searchParams.get("templateId"));
  const { findTemplateById, isLoading: templatesLoading } = useTemplates({ enabled: needsTemplates });
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  // === Questions sync hook ===
  const { syncQuestions: syncQuestionsToBackend } = useQuestionsSync();

  // === Preset demo state (unchanged) ===
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [phase, setPhase] = useState<ArchitectPhase>("context");
  const [agentState, setAgentState] = useState<AgentState>("disconnected");
  const [mockInputLevel, setMockInputLevel] = useState(0);
  const [questions, setQuestions] = useState<StructuredQuestion[]>([]);
  const [interviewContext, setInterviewContext] = useState<InterviewContext>(
    {},
  );
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // === Conversation state (stable ID for session) ===
  // conversationId is generated on template selection or first agent start
  // and persists throughout the editing session until explicit reset
  const [conversationId, setConversationId] = useState<string | null>(null);
  // Flag to control WS subscription - only true when agent session is active
  // Template selection sets conversationId but NOT this flag
  const [isAgentSessionActive, setIsAgentSessionActive] = useState(false);
  const [realInputLevel, setRealInputLevel] = useState(0);

  // Refs for real agent session
  const conversationRef = useRef<ElevenLabsConversation | null>(null);
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mockLevelIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Debounce ref for question sync
  const syncDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // === Sync tracking for anti-loop guard ===
  // Track the source of question updates to decide sync behavior
  type UpdateSource = "user" | "ws" | "template" | null;
  const updateSourceRef = useRef<UpdateSource>(null);
  // Track hash of last synced questions to prevent duplicate syncs
  const lastSyncedHashRef = useRef<string | null>(null);

  // Helper: compute simple hash of questions for comparison
  const computeQuestionsHash = useCallback((qs: StructuredQuestion[]): string => {
    return qs.map((q) => `${q.id}:${q.text}`).join("|");
  }, []);

  // WebSocket hook for real-time questions
  // Only connects when agent session is active (not on template selection)
  const {
    questionsFromWs,
    isConnected: isWsConnected,
    error: wsError,
    applyTemplateEvent,
    clearApplyTemplateEvent,
    disconnect: disconnectWs,
    syncQuestions,
  } = useInterviewArchitectWs(conversationId, isAgentSessionActive);

  // Toast for notifications
  const { toast } = useToast();

  const currentData = selectedPresetId
    ? mockDataByPreset[selectedPresetId]
    : null;

  // Determine if we're in real mode (no preset selected)
  const isRealMode = !selectedPresetId;

  // === Mock level simulation for preset demos ===
  const startMockLevelPolling = () => {
    if (mockLevelIntervalRef.current)
      clearInterval(mockLevelIntervalRef.current);
    mockLevelIntervalRef.current = setInterval(() => {
      setMockInputLevel(Math.random() * 0.7 + 0.1);
    }, 100);
  };

  const stopMockLevelPolling = () => {
    if (mockLevelIntervalRef.current) {
      clearInterval(mockLevelIntervalRef.current);
      mockLevelIntervalRef.current = null;
    }
    setMockInputLevel(0);
  };

  // === Real volume polling ===
  const startRealVolumePolling = useCallback(() => {
    if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
    volumeIntervalRef.current = setInterval(() => {
      if (conversationRef.current) {
        const inputVol = conversationRef.current.getInputVolume() || 0;
        setRealInputLevel(inputVol);
      }
    }, 80);
  }, []);

  const stopRealVolumePolling = useCallback(() => {
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
    setRealInputLevel(0);
  }, []);

  // === Debounced sync helper with anti-loop guard ===
  const debouncedSync = useCallback((
    questionsToSync: StructuredQuestion[],
    source: "user" | "ws" | "template"
  ) => {
    // Clear any pending sync
    if (syncDebounceRef.current) {
      clearTimeout(syncDebounceRef.current);
    }

    // Track the source of this update
    updateSourceRef.current = source;

    // Compute hash for anti-loop guard
    const currentHash = computeQuestionsHash(questionsToSync);

    // Skip if hash matches last synced (prevents loops)
    if (currentHash === lastSyncedHashRef.current) {
      console.log(`[Sync] SKIP | source: ${source} | reason: hash unchanged | questions: ${questionsToSync.length}`);
      return;
    }

    // Debounce for 300ms to avoid spamming backend on rapid edits
    syncDebounceRef.current = setTimeout(() => {
      if (conversationId) {
        const syncPayload = questionsToSync.map(structuredToSyncQuestion);

        // Log sync details
        console.log(`[Sync] POST | source: ${source} | conversationId: ${conversationId} | questions: ${syncPayload.length}`);
        console.log(`[Sync] POST | ids: [${syncPayload.map(q => q.id).join(", ")}]`);

        // Update last synced hash BEFORE posting to prevent re-sync on echo
        lastSyncedHashRef.current = currentHash;

        // Use the WS hook's syncQuestions for active sessions, otherwise use direct sync
        if (isAgentSessionActive) {
          syncQuestions(syncPayload as ActualQuestion[]);
        } else {
          syncQuestionsToBackend(conversationId, syncPayload);
        }
      }
    }, 300);
  }, [conversationId, syncQuestions, syncQuestionsToBackend, isAgentSessionActive, computeQuestionsHash]);

  // === Convert WS questions to StructuredQuestion objects ===
  // Track previous length to detect changes (including deletions to empty)
  const prevWsQuestionsLengthRef = useRef<number>(0);

  useEffect(() => {
    // Only process in real mode (not preset demos)
    if (!isRealMode) return;

    // Detect if this is a meaningful change (new questions or deletion)
    const hasQuestions = questionsFromWs.length > 0;
    const hadQuestions = prevWsQuestionsLengthRef.current > 0;
    const lengthChanged = questionsFromWs.length !== prevWsQuestionsLengthRef.current;

    // Update ref for next comparison
    prevWsQuestionsLengthRef.current = questionsFromWs.length;

    // Skip if no questions and never had questions (initial state)
    if (!hasQuestions && !hadQuestions) return;

    console.log("[WS] Received questions update | count:", questionsFromWs.length, "| changed:", lengthChanged);
    if (questionsFromWs.length > 0) {
      console.log("[WS] Question IDs:", questionsFromWs.map(q => q.id).join(", "));
    }

    // Convert ActualQuestion objects to StructuredQuestion objects (using backend IDs)
    const structuredQuestions = questionsFromWs.map(actualQuestionToStructured);

    setQuestions(structuredQuestions);

    // Update phase when questions arrive
    if (structuredQuestions.length > 0 && phase === "context") {
      setPhase("structure");
    }

    // Sync WS-driven updates to backend (with anti-loop guard)
    // This ensures backend persistence even for agent-generated questions
    if (conversationId && lengthChanged) {
      console.log("[WS] Triggering sync for WS-driven update");
      debouncedSync(structuredQuestions, "ws");
    }
  }, [questionsFromWs, isRealMode, phase, conversationId, debouncedSync]);

  // === Real agent session management ===
  const startRealAgentSession = async () => {
    console.log("[InterviewArchitectTest] Starting real agent session...");
    setAgentState("connecting");

    try {
      // 1. Use existing conversationId or generate new one
      // This ensures the same conversationId is used for template questions and agent session
      let activeConversationId = conversationId;
      if (!activeConversationId) {
        activeConversationId = generateConversationId();
        console.log("[InterviewArchitectTest] Generated new conversationId:", activeConversationId);
        setConversationId(activeConversationId);
      } else {
        console.log("[InterviewArchitectTest] Reusing existing conversationId:", activeConversationId);
      }

      // 2. Request microphone access
      console.log("[InterviewArchitectTest] Requesting microphone access...");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaStreamRef.current = mediaStream;
      console.log("[InterviewArchitectTest] Microphone access granted");

      // 3. Fetch signed URL for Interview Architect agent
      console.log("[InterviewArchitectTest] Fetching signed URL...");
      const signedUrl = await fetchSignedUrl();
      console.log(
        "[InterviewArchitectTest] Signed URL fetch success:",
        signedUrl,
      );

      // 4. Create and start ElevenLabs conversation
      console.log(
        "[InterviewArchitectTest] Starting ElevenLabs conversation...",
      );
      const conversation = new ElevenLabsConversation({
        onStatusChange: (status) => {
          console.log(
            "[InterviewArchitectTest] ElevenLabs status change:",
            status,
          );
          if (status === "connected") {
            setAgentState("connected");
            startRealVolumePolling();
          } else if (status === "disconnected") {
            setAgentState("disconnected");
            stopRealVolumePolling();
          } else if (status === "error") {
            setAgentState("disconnected");
            stopRealVolumePolling();
          }
        },
        onError: (error) => {
          console.error("[InterviewArchitectTest] ElevenLabs error:", error);
        },
        onAssistantMessage: (message) => {
          console.log("[InterviewArchitectTest] Agent message:", message);
        },
        onUserMessage: (message) => {
          console.log("[InterviewArchitectTest] User message:", message);
        },
      });

      conversationRef.current = conversation;

      // Start session with dynamic variables including ConversationId
      await conversation.startSession(signedUrl, mediaStream, {
        dynamicVariables: {
          ConversationId: activeConversationId,
        },
      });

      // Enable WS subscription now that agent session is active
      setIsAgentSessionActive(true);

      console.log(
        "[InterviewArchitectTest] ElevenLabs session started with ConversationId:",
        activeConversationId,
      );
    } catch (error) {
      console.error(
        "[InterviewArchitectTest] Failed to start real agent session:",
        error,
      );
      setAgentState("disconnected");
      setIsAgentSessionActive(false);
      // Note: We do NOT clear conversationId on error - it persists for the session

      // Cleanup media stream if acquired
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    }
  };

  const stopRealAgentSession = async () => {
    console.log("[InterviewArchitectTest] Stopping real agent session...");
    setAgentState("disconnecting");

    try {
      // End ElevenLabs session
      if (conversationRef.current) {
        await conversationRef.current.endSession();
        conversationRef.current = null;
      }

      // Stop volume polling
      stopRealVolumePolling();

      // Disconnect WebSocket
      disconnectWs();

      // Cleanup media stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }

      console.log("[InterviewArchitectTest] Real agent session stopped");
    } catch (error) {
      console.error(
        "[InterviewArchitectTest] Error stopping real agent session:",
        error,
      );
    } finally {
      setAgentState("disconnected");
      setIsAgentSessionActive(false);
    }
  };

  // === Preset demo handlers (unchanged) ===
  const handleSelectPreset = (presetId: string) => {
    // If we were in real mode, cleanup first
    if (conversationId) {
      stopRealAgentSession();
      setConversationId(null);
    }

    // Clear template selection and agent session flag
    setSelectedTemplate(null);
    setIsAgentSessionActive(false);

    setSelectedPresetId(presetId);
    setPhase("context");
    setAgentState("disconnected");
    setQuestions([]);
    setInterviewContext({});
    setDemoStep(0);
    stopMockLevelPolling();
  };

  const advanceDemo = () => {
    if (!currentData) {
      return;
    }

    const newStep = demoStep + 1;
    setDemoStep(newStep);

    if (newStep === 1) {
      setInterviewContext(currentData.context);
      setPhase("context");
    } else if (newStep === 2) {
      setPhase("structure");

      currentData.questions.forEach((q, i) => {
        setTimeout(() => {
          setQuestions((prev) => [...prev, { ...q, id: `${Date.now()}-${i}` }]);
          if (i === currentData.questions.length - 1) {
            setTimeout(() => {
              setPhase("refine");
            }, 500);
          }
        }, i * 400);
      });
    }
  };

  // === Unified agent toggle handler ===
  const handleAgentToggle = () => {
    if (agentState === "connecting" || agentState === "disconnecting") return;

    if (isRealMode) {
      // Real mode: start/stop actual ElevenLabs session
      if (agentState === "disconnected") {
        startRealAgentSession();
      } else if (agentState === "connected") {
        stopRealAgentSession();
      }
    } else {
      // Preset demo mode: simulate voice interaction
      if (agentState === "disconnected") {
        setAgentState("connecting");

        setTimeout(() => {
          setAgentState("connected");
          startMockLevelPolling();

          setTimeout(() => {
            setAgentState("disconnecting");
            stopMockLevelPolling();

            setTimeout(() => {
              advanceDemo();
              setAgentState("disconnected");
            }, 1500);
          }, 2500);
        }, 400);
      } else if (agentState === "connected") {
        setAgentState("disconnecting");
        stopMockLevelPolling();
        setTimeout(() => {
          advanceDemo();
          setAgentState("disconnected");
        }, 1500);
      }
    }
  };

  // === Question handlers (user-driven) ===
  const handleEditQuestion = (id: string, newText: string) => {
    setQuestions((prev) => {
      const updated = prev.map((q) => (q.id === id ? { ...q, text: newText } : q));

      // Sync to backend if conversationId exists (template or real agent mode)
      if (conversationId) {
        console.log("[User] Question edited:", { id, newText: newText.substring(0, 50) });
        debouncedSync(updated, "user");
      }

      return updated;
    });
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => {
      const updated = prev.filter((q) => q.id !== id);

      // Sync to backend if conversationId exists
      if (conversationId) {
        console.log("[User] Question deleted:", { id, remainingCount: updated.length });
        debouncedSync(updated, "user");
      }

      return updated;
    });
  };

  const handleReorder = (newOrder: StructuredQuestion[]) => {
    setQuestions(newOrder);

    // Sync to backend if conversationId exists
    if (conversationId) {
      console.log("[User] Questions reordered | count:", newOrder.length);
      debouncedSync(newOrder, "user");
    }
  };

  const handleFinalize = () => {
    setPhase("finalize");
    setShowFinalizeModal(true);
  };

  const handleReset = () => {
    // Clear any pending sync
    if (syncDebounceRef.current) {
      clearTimeout(syncDebounceRef.current);
      syncDebounceRef.current = null;
    }

    // Cleanup real agent session if active
    if (conversationRef.current) {
      stopRealAgentSession();
    }

    // Reset all state - this clears conversationId for a fresh start
    setSelectedPresetId(null);
    setSelectedTemplate(null);
    setConversationId(null);
    setIsAgentSessionActive(false);
    setPhase("context");
    setAgentState("disconnected");
    setQuestions([]);
    setInterviewContext({});
    setDemoStep(0);
    stopMockLevelPolling();
    stopRealVolumePolling();

    console.log("[InterviewArchitectTest] Reset complete - conversationId cleared");
  };

  const getHelperText = () => {
    if (agentState === "connected")
      return "Listening... Tap to stop and process.";
    if (agentState === "connecting") return "Connecting to assistant...";
    if (agentState === "disconnecting") return "Processing your input...";

    if (isRealMode) {
      if (questions.length > 0)
        return "Review the questions, or speak to add more";
      return "Tap to start speaking. Questions will appear as we talk.";
    }

    // Preset demo mode
    if (demoStep === 0)
      return "Tap to start speaking. Questions will appear as we talk.";
    if (demoStep === 1) return "Tap to share more details";
    if (questions.length > 0)
      return "Review the questions, or speak to refine them";
    return "Tap to start speaking. Questions will appear as we talk.";
  };

  // Determine which input level to use
  const inputLevel = isRealMode ? realInputLevel : mockInputLevel;

  // Log WS connection status
  useEffect(() => {
    if (conversationId) {
      console.log("[InterviewArchitectTest] WS connection status:", {
        isWsConnected,
        wsError,
      });
    }
  }, [isWsConnected, wsError, conversationId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear debounce timer
      if (syncDebounceRef.current) {
        clearTimeout(syncDebounceRef.current);
      }
      if (conversationRef.current) {
        conversationRef.current.endSession();
      }
      stopMockLevelPolling();
      stopRealVolumePolling();
      disconnectWs();
    };
  }, [stopRealVolumePolling, disconnectWs]);

  // === Handle apply_template WS event ===
  // When agent sends apply_template, ADD template questions to existing (no replace)
  useEffect(() => {
    if (!applyTemplateEvent) return;

    const { templateId } = applyTemplateEvent;
    console.log("[InterviewArchitectTest] apply_template event received:", templateId);

    // If templates aren't loaded yet, trigger loading and wait
    if (!needsTemplates) {
      console.log("[InterviewArchitectTest] Triggering templates load for apply_template");
      setNeedsTemplates(true);
      return; // Effect will re-run when templates are loaded
    }

    // Still loading templates, wait
    if (templatesLoading) {
      console.log("[InterviewArchitectTest] Waiting for templates to load...");
      return;
    }

    // Find template by ID
    const template = findTemplateById(templateId);
    if (!template) {
      console.error("[InterviewArchitectTest] Template not found:", templateId);
      clearApplyTemplateEvent();
      return;
    }

    console.log("[InterviewArchitectTest] Found template:", template.title, "with", template.questions.length, "questions");

    // Sort template questions by order
    const sortedTemplateQuestions = [...template.questions].sort((a, b) => a.order - b.order);

    // Normalize text for deduplication (lowercase, trim, remove extra spaces)
    const normalizeText = (text: string) => text.toLowerCase().trim().replace(/\s+/g, " ");

    // Get existing question texts for dedup
    const existingTexts = new Set(questions.map((q) => normalizeText(q.text)));

    // Filter out duplicates and create new StructuredQuestion items
    const newQuestions: StructuredQuestion[] = [];
    for (const tq of sortedTemplateQuestions) {
      const normalized = normalizeText(tq.text);
      if (!existingTexts.has(normalized)) {
        // Generate stable ID: tpl-<templateId>-<questionId>
        const stableId = `tpl-${templateId}-${tq.id}`;
        newQuestions.push({
          id: stableId,
          text: tq.text,
          phase: "core" as const,
        });
        existingTexts.add(normalized); // Prevent duplicates within template
      } else {
        console.log("[InterviewArchitectTest] Skipping duplicate question:", tq.text.substring(0, 50));
      }
    }

    console.log("[InterviewArchitectTest] Adding", newQuestions.length, "new questions from template");

    if (newQuestions.length > 0) {
      // Merge: ADD to existing questions (no delete)
      const mergedQuestions = [...questions, ...newQuestions];
      setQuestions(mergedQuestions);

      // Update phase if needed
      if (phase === "context") {
        setPhase("structure");
      }

      // Sync merged questions to backend (via debouncedSync for consistency)
      if (conversationId) {
        console.log("[Template] apply_template | syncing merged questions | count:", mergedQuestions.length);
        debouncedSync(mergedQuestions, "template");
      }

      // Show toast notification
      toast({
        title: `Template applied: ${template.title}`,
        description: `Added ${newQuestions.length} question${newQuestions.length !== 1 ? "s" : ""} to your interview.`,
      });
    } else {
      toast({
        title: "Template already applied",
        description: "All questions from this template are already in your list.",
        variant: "default",
      });
    }

    // Clear the event after handling
    clearApplyTemplateEvent();
  }, [applyTemplateEvent, findTemplateById, questions, conversationId, phase, syncQuestionsToBackend, clearApplyTemplateEvent, toast, needsTemplates, templatesLoading, debouncedSync]);

  // === Handle templateId from URL query params ===
  // When coming from /templates page with a template selected
  const templateIdLoadedRef = useRef<string | null>(null);
  useEffect(() => {
    const templateId = searchParams.get("templateId");
    if (!templateId || templatesLoading) return;
    // Prevent loading the same template twice
    if (templateIdLoadedRef.current === templateId) return;

    const template = findTemplateById(templateId);
    if (template) {
      console.log("[InterviewArchitectTest] Loading template from URL:", templateId);
      templateIdLoadedRef.current = templateId;

      // Inline the template selection logic to avoid dependency issues
      // This mirrors handleSelectTemplate but is safe for useEffect
      const newConversationId = generateConversationId();
      setConversationId(newConversationId);
      setSelectedTemplate(template);
      setSelectedPresetId(null);
      setDemoStep(0);

      // Convert template questions to StructuredQuestion format
      const sortedQuestions = [...template.questions].sort((a, b) => a.order - b.order);
      const structuredQuestions: StructuredQuestion[] = sortedQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        phase: "core" as const,
      }));

      setQuestions(structuredQuestions);
      setPhase("structure");
      setAgentState("disconnected");
      setInterviewContext({
        type: template.title,
        goal: template.scenario || undefined,
      });

      // Sync questions to backend (direct call since conversationId not in state yet)
      const syncPayload = structuredQuestions.map(structuredToSyncQuestion);
      console.log(`[Sync] POST | source: template | conversationId: ${newConversationId} | questions: ${syncPayload.length}`);
      console.log(`[Sync] POST | ids: [${syncPayload.map(q => q.id).join(", ")}]`);

      // Update hash ref to prevent re-sync when WS echoes back
      lastSyncedHashRef.current = computeQuestionsHash(structuredQuestions);
      updateSourceRef.current = "template";

      syncQuestionsToBackend(newConversationId, syncPayload);

      // Clear the query param after loading
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, templatesLoading, findTemplateById, setSearchParams, syncQuestionsToBackend, computeQuestionsHash]);

  // Show nothing while checking auth (prevents flash before redirect)
  if (authLoading || !isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="section-container">
          {/* Page Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Interview Architect
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Voice-First Question Builder
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Speak naturally to design structured, expert-level interview
              questions
            </p>
          </div>

          {/* Phase Indicator */}
          <ArchitectPhaseIndicator currentPhase={phase} className="mb-6" />

          {/* Interview Context Badges */}
          <InterviewContextBadges
            context={interviewContext}
            className="justify-center mb-8"
          />

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
            {/* Left Column: Agent Card */}
            <div className="lg:col-span-4 space-y-4">
              <ArchitectAgentCard
                agentName="Interview Architect"
                agentDescription="I'll help you design structured, expert-level interview questions."
                state={agentState}
                helperText={getHelperText()}
                inputLevel={inputLevel}
                onToggle={handleAgentToggle}
              />

              {/* Reset button */}
              {(questions.length > 0 || selectedPresetId || selectedTemplate || conversationId) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center"
                >
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                </motion.div>
              )}

            </div>

            {/* Right Column: Question Cards - fixed height matching left column */}
            <div className="lg:col-span-8">
              <div className="glass-card rounded-2xl flex flex-col h-[420px] lg:h-[480px] overflow-hidden">
                {/* Sticky header */}
                <div className="flex items-center justify-between p-5 pb-3 flex-shrink-0">
                  <h3 className="text-sm font-medium text-foreground">
                    Question Sequence
                  </h3>
                  {questions.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {questions.length} question
                      {questions.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {/* Scrollable content area */}
                <div className="flex-1 min-h-0 relative">
                  <div className="h-full overflow-y-auto custom-scrollbar px-5">
                    <AnimatePresence mode="wait">
                      {questions.length === 0 ? (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center py-16 text-center"
                        >
                          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-muted-foreground/50" />
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">
                            Questions will appear here as you speak
                          </p>
                          <p className="text-muted-foreground/60 text-xs max-w-xs">
                            {selectedPresetId
                              ? "Tap the microphone to start the conversation"
                              : "Start speaking or browse templates to create your interview"}
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="questions"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="pb-2"
                        >
                          <Reorder.Group
                            axis="y"
                            values={questions}
                            onReorder={handleReorder}
                            className="space-y-3"
                          >
                            {questions.map((question, index) => (
                              <Reorder.Item
                                key={question.id}
                                value={question}
                                className="cursor-grab active:cursor-grabbing"
                              >
                                <StructuredQuestionCard
                                  question={question}
                                  index={index}
                                  onEdit={handleEditQuestion}
                                  onDelete={handleDeleteQuestion}
                                />
                              </Reorder.Item>
                            ))}
                          </Reorder.Group>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* Bottom fade overlay - scroll affordance */}
                  {questions.length > 3 && (
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card/90 to-transparent pointer-events-none rounded-b-2xl" />
                  )}
                </div>

                {/* Sticky footer CTA */}
                {questions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex-shrink-0 p-4 pt-3 border-t border-border/50 flex justify-center"
                  >
                    <PrimaryButton
                      onClick={handleFinalize}
                      className="px-8"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Finalize Questions
                    </PrimaryButton>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Browse Templates Link */}
          <div className="max-w-6xl mx-auto mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={() => navigate("/templates")}
              className="gap-2"
            >
              <LayoutTemplate className="w-4 h-4" />
              Browse Templates
            </Button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Finalize Modal */}
      <ArchitectFinalizeModal
        isOpen={showFinalizeModal}
        onClose={() => setShowFinalizeModal(false)}
        questions={questions}
        interviewType={interviewContext.type}
        defaultTitle={selectedTemplate?.title}
      />
    </div>
  );
};

export default InterviewArchitectTest;
