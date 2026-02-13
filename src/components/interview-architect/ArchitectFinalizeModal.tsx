import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, X, FileText, Loader2, ExternalLink, Sparkles } from "lucide-react";
import { useState } from "react";
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

interface ArchitectFinalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: StructuredQuestion[];
  interviewType?: string;
  defaultTitle?: string;
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
}: ArchitectFinalizeModalProps) => {
  const [interviewTitle, setInterviewTitle] = useState(defaultTitle || "");
  const [savedData, setSavedData] = useState<SavedInterviewData | null>(null);

  const { createInterview, isLoading: isCreating } = useCreateInterview();
  const { toast } = useToast();

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

    const response = await createInterview({
      title: trimmedTitle,
      questions: questions.map((q) => q.text),
    });

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
            />
          ) : (
            <FinalizeFormStep
              key="form"
              questions={questions}
              interviewType={interviewType}
              interviewTitle={interviewTitle}
              onTitleChange={setInterviewTitle}
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
