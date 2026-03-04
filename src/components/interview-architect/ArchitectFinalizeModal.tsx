import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, X, FileText, Loader2, ExternalLink, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { StructuredQuestion } from "./StructuredQuestionCard";
import { useCreateInterview } from "@/hooks/api/useCreateInterview";
import { callApi } from "@/lib/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import { useToast } from "@/hooks/use-toast";
import FinalizeFormStep from "./FinalizeFormStep";
import FinalizeSuccessStep from "./FinalizeSuccessStep";

interface GenerateIntroductionResponse {
  introduction: string;
}

/**
 * Introduction source tracking
 * - "agent": Introduction came from WebSocket (agent generated)
 * - "generated": Introduction came from POST /interview/generate-introduction
 * - null: No introduction yet
 */
type IntroductionSource = "agent" | "generated" | null;

interface ArchitectFinalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: StructuredQuestion[];
  interviewType?: string;
  defaultTitle?: string;
  /** Existing introduction from main page (highest priority - don't regenerate) */
  existingIntroduction?: string | null;
  /** Introduction from agent (via WebSocket) - takes priority over API generation */
  agentIntroduction?: string | null;
  /** Called when agent introduction is used (for cleanup) */
  onIntroductionUsed?: () => void;
  /** Called after interview is successfully created - use for cleanup (clear draft, URL, etc.) */
  onInterviewCreated?: () => void;
}

interface SavedInterviewData {
  title: string;
  questionsCount: number;
  publicUrl: string;
}

const ArchitectFinalizeModal = ({
  isOpen,
  onClose,
  questions,
  interviewType,
  defaultTitle,
  existingIntroduction,
  agentIntroduction,
  onIntroductionUsed,
  onInterviewCreated,
}: ArchitectFinalizeModalProps) => {
  const [interviewTitle, setInterviewTitle] = useState(defaultTitle || "");
  const [savedData, setSavedData] = useState<SavedInterviewData | null>(null);
  const [introduction, setIntroduction] = useState("");
  const [introductionSource, setIntroductionSource] = useState<IntroductionSource>(null);
  const [isGeneratingIntro, setIsGeneratingIntro] = useState(false);
  const [introError, setIntroError] = useState<string | null>(null);
  // Track if user has manually edited the introduction
  const [userHasEditedIntro, setUserHasEditedIntro] = useState(false);

  // Track if we've already generated intro for current questions to avoid re-fetching
  const generatedForQuestionsRef = useRef<string | null>(null);
  // Track if we've already used the agent introduction for this session
  const usedAgentIntroRef = useRef(false);

  const { createInterview, isLoading: isCreating } = useCreateInterview();
  const { toast } = useToast();

  // Handle introduction when modal opens - triple source logic
  useEffect(() => {
    if (!isOpen || questions.length === 0) return;

    // Don't overwrite if user has manually edited
    if (userHasEditedIntro) return;

    // Create a hash of question texts to detect if questions changed
    const questionsHash = questions.map((q) => q.text).join("|");

    // PRIORITY 1: Use existing introduction from main page (highest priority - don't regenerate)
    if (existingIntroduction) {
      console.log("[ArchitectFinalizeModal] Using existing introduction from main page | length:", existingIntroduction.length);
      setIntroduction(existingIntroduction);
      setIntroductionSource(null); // Don't set source since it's from main page
      generatedForQuestionsRef.current = questionsHash;
      return;
    }

    // PRIORITY 2: Use agent introduction if available
    if (agentIntroduction && !usedAgentIntroRef.current) {
      console.log("[ArchitectFinalizeModal] Using agent introduction | length:", agentIntroduction.length);
      setIntroduction(agentIntroduction);
      setIntroductionSource("agent");
      usedAgentIntroRef.current = true;
      generatedForQuestionsRef.current = questionsHash;

      // Notify parent that we used the agent introduction
      onIntroductionUsed?.();
      return;
    }

    // PRIORITY 3: Generate introduction via API if no existing or agent introduction
    // Skip if we already generated for these exact questions
    if (generatedForQuestionsRef.current === questionsHash) return;

    // Skip if introductionSource is "agent" (agent intro was already set)
    if (introductionSource === "agent") return;

    const generateIntroductionFromApi = async () => {
      setIsGeneratingIntro(true);
      setIntroError(null);

      try {
        console.log("[ArchitectFinalizeModal] Generating introduction via API...");
        const response = await callApi<GenerateIntroductionResponse>(
          API_ROUTES.generateIntroduction,
          {
            method: "POST",
            body: { title: "", questions: questions.map((q) => q.text) } as unknown as BodyInit,
          }
        );

        setIntroduction(response.introduction);
        setIntroductionSource("generated");
        generatedForQuestionsRef.current = questionsHash;
        console.log("[ArchitectFinalizeModal] Introduction generated | length:", response.introduction.length);
      } catch (err) {
        console.error("[ArchitectFinalizeModal] Failed to generate introduction:", err);
        setIntroError("Failed to generate introduction. You can write one manually.");
      } finally {
        setIsGeneratingIntro(false);
      }
    };

    generateIntroductionFromApi();
  }, [isOpen, questions, existingIntroduction, agentIntroduction, userHasEditedIntro, introductionSource, onIntroductionUsed]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Don't reset generatedForQuestionsRef so we don't re-fetch if reopened with same questions
      setIntroError(null);
    }
  }, [isOpen]);

  const handleCreateInterview = async () => {
    const trimmedTitle = interviewTitle.trim();

    if (!trimmedTitle) {
      toast({
        title: "Title required",
        description: "Please enter a title for your interview",
        variant: "destructive",
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "No questions",
        description: "Please add at least one question",
        variant: "destructive",
      });
      return;
    }

    const payload: { title: string; questions: string[]; introduction?: string } = {
      title: trimmedTitle,
      questions: questions.map((q) => q.text),
    };

    // Include introduction if provided
    if (introduction.trim()) {
      payload.introduction = introduction.trim();
    }

    const response = await createInterview(payload);

    if (!response) {
      toast({
        title: "Error",
        description: "Failed to create interview. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      await callApi(API_ROUTES.activateInterview(response.id), {
        method: "PUT",
      });
    } catch (activateError) {
      console.error("[ArchitectFinalizeModal] Failed to activate:", activateError);
      toast({
        title: "Error",
        description: "Interview created but activation failed. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const origin = window.location.origin;
    const uniqueKey = response.link?.unique_key;
    const publicUrl = `${origin}/i/${uniqueKey}`;

    setSavedData({
      title: trimmedTitle,
      questionsCount: questions.length,
      publicUrl,
    });
    // NOTE: Don't call onInterviewCreated here - autosave would immediately re-save the draft
    // Cleanup is deferred to when user clicks "Done" in the success step
  };

  const handleClose = () => {
    setSavedData(null);
    setInterviewTitle(defaultTitle || "");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="p-0 gap-0 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden sm:max-w-2xl sm:w-[calc(100%-2rem)] sm:rounded-2xl sm:border-border/50"
        onPointerDownOutside={(e) => isCreating && e.preventDefault()}
        onEscapeKeyDown={(e) => isCreating && e.preventDefault()}
      >
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">
          {savedData ? "Interview Created" : "Finalize Interview"}
        </DialogTitle>

        <AnimatePresence mode="wait">
          {savedData ? (
            <FinalizeSuccessStep
              key="success"
              savedData={savedData}
              onClose={handleClose}
              onDone={onInterviewCreated}
            />
          ) : (
            <FinalizeFormStep
              key="form"
              questions={questions}
              interviewType={interviewType}
              interviewTitle={interviewTitle}
              onTitleChange={setInterviewTitle}
              introduction={introduction}
              introductionSource={introductionSource}
              onIntroductionChange={(newIntro) => {
                setIntroduction(newIntro);
                // Mark as user-edited if the value actually changed
                if (newIntro !== introduction) {
                  setUserHasEditedIntro(true);
                }
              }}
              isGeneratingIntro={isGeneratingIntro}
              introError={introError}
              onCreateInterview={handleCreateInterview}
              onClose={handleClose}
              isCreating={isCreating}
            />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default ArchitectFinalizeModal;
