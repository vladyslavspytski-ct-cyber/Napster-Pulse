import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, X, FileText, Loader2, ExternalLink, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StructuredQuestion } from "./StructuredQuestionCard";
import { useCreateInterview } from "@/hooks/api/useCreateInterview";
import { callApi } from "@/lib/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import { useToast } from "@/hooks/use-toast";

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
  const [copied, setCopied] = useState(false);
  const [interviewTitle, setInterviewTitle] = useState(defaultTitle || "");
  const [savedData, setSavedData] = useState<SavedInterviewData | null>(null);

  const { createInterview, isLoading: isCreating } = useCreateInterview();
  const { toast } = useToast();

  const handleCopy = () => {
    const text = questions.map((q, i) => `${i + 1}. ${q.text}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    if (savedData?.publicUrl) {
      navigator.clipboard.writeText(savedData.publicUrl);
      toast({
        title: "Link copied",
        description: "Interview link copied to clipboard",
      });
    }
  };

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

    toast({
      title: "Interview created",
      description: "Your interview is ready to share",
    });
  };

  const handleClose = () => {
    setSavedData(null);
    setInterviewTitle(defaultTitle || "");
    onClose();
  };

  // Success view
  if (savedData) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={handleClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[50%] -translate-y-1/2 mx-auto max-w-md z-50 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
            >
              <div className="glass-card rounded-2xl shadow-card overflow-hidden">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-interu-mint-light flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-interu-mint" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Interview Created!
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    "{savedData.title}" with {savedData.questionsCount} questions
                  </p>
                </div>
                <div className="px-6 pb-6">
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    Share this link with candidates
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={savedData.publicUrl}
                      readOnly
                      className="flex-1 text-sm"
                    />
                    <Button size="icon" variant="outline" onClick={handleCopyLink}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => window.open(savedData.publicUrl, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-6 border-t border-border">
                  <PrimaryButton className="w-full" onClick={handleClose}>
                    Done
                  </PrimaryButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-4 bottom-4 mx-auto max-w-2xl z-50 flex flex-col sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:top-[5vh] sm:bottom-[5vh]"
          >
            <div className="glass-card rounded-2xl shadow-card overflow-hidden flex flex-col max-h-full">
              {/* Header - fixed */}
              <div className="flex items-center justify-between p-5 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Finalize Interview
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {questions.length} question{questions.length !== 1 ? "s" : ""}
                      {interviewType && ` · ${interviewType}`}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-xl">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Title input - fixed */}
              <div className="p-5 border-b border-border flex-shrink-0">
                <Label htmlFor="interview-title" className="text-sm font-medium">
                  Interview Title
                </Label>
                <Input
                  id="interview-title"
                  placeholder="e.g., Senior Developer Interview"
                  value={interviewTitle}
                  onChange={(e) => setInterviewTitle(e.target.value)}
                  className="mt-2 rounded-xl"
                  autoFocus
                />
              </div>

              {/* Questions list - scrollable */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 min-h-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-foreground">Questions</h3>
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs">
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy All
                      </>
                    )}
                  </Button>
                </div>
                <div className="space-y-2">
                  {questions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-muted/50"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <p className="text-sm text-foreground leading-relaxed">{question.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer - fixed / sticky CTA */}
              <div className="p-5 border-t border-border flex-shrink-0 flex flex-col sm:flex-row gap-3">
                <PrimaryButton
                  className="flex-1"
                  onClick={handleCreateInterview}
                  disabled={isCreating || questions.length === 0}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Interview
                    </>
                  )}
                </PrimaryButton>
                <Button variant="ghost" className="sm:flex-none" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ArchitectFinalizeModal;
