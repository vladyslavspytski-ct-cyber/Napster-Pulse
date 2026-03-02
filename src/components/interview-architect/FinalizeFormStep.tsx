import { motion } from "framer-motion";
import { Check, Copy, FileText, Loader2, Sparkles, AlertCircle, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StructuredQuestion } from "./StructuredQuestionCard";

/**
 * Introduction source tracking
 * - "agent": Introduction came from WebSocket (agent generated)
 * - "generated": Introduction came from POST /interview/generate-introduction
 * - null: No introduction yet
 */
type IntroductionSource = "agent" | "generated" | null;

interface FinalizeFormStepProps {
  questions: StructuredQuestion[];
  interviewType?: string;
  interviewTitle: string;
  onTitleChange: (title: string) => void;
  introduction: string;
  introductionSource: IntroductionSource;
  onIntroductionChange: (intro: string) => void;
  isGeneratingIntro: boolean;
  introError: string | null;
  onCreateInterview: () => void;
  onClose: () => void;
  isCreating: boolean;
}

const FinalizeFormStep = ({
  questions,
  interviewType,
  interviewTitle,
  onTitleChange,
  introduction,
  introductionSource,
  onIntroductionChange,
  isGeneratingIntro,
  introError,
  onCreateInterview,
  onClose,
  isCreating,
}: FinalizeFormStepProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = questions.map((q, i) => `${i + 1}. ${q.text}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full sm:max-h-[90vh]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-border flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Finalize Interview</h2>
          <p className="text-sm text-muted-foreground">
            {questions.length} question{questions.length !== 1 ? "s" : ""}
            {interviewType && ` · ${interviewType}`}
          </p>
        </div>
      </div>

      {/* Title input */}
      <div className="p-5 border-b border-border flex-shrink-0">
        <Label htmlFor="interview-title" className="text-sm font-medium">
          Interview Title
        </Label>
        <Input
          id="interview-title"
          placeholder="e.g., Senior Developer Interview"
          value={interviewTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="mt-2 rounded-xl"
          autoFocus
        />
      </div>

      {/* Introduction textarea */}
      <div className="p-5 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <Label htmlFor="interview-introduction" className="text-sm font-medium">
            Introduction Message
          </Label>
          {isGeneratingIntro && (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              Generating...
            </span>
          )}
          {!isGeneratingIntro && introductionSource === "agent" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
              <Sparkles className="w-2.5 h-2.5" />
              From Agent
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          This message will be shown to participants before the interview begins.
        </p>
        {introError && (
          <div className="flex items-center gap-2 text-xs text-amber-600 mb-2">
            <AlertCircle className="w-3 h-3" />
            {introError}
          </div>
        )}
        <Textarea
          id="interview-introduction"
          placeholder={isGeneratingIntro ? "Generating introduction..." : "Enter an introduction message for participants..."}
          value={introduction}
          onChange={(e) => onIntroductionChange(e.target.value)}
          className="mt-1 rounded-xl min-h-[100px] resize-none"
          disabled={isGeneratingIntro}
        />
      </div>

      {/* Questions list – scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">Questions</h3>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs">
            {copied ? (
              <>
                <Check className="w-3 h-3 mr-1" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" /> Copy All
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

      {/* Footer CTA – always visible, sticky on mobile */}
      <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-5 border-t border-border flex-shrink-0 flex flex-col sm:flex-row gap-3 mt-auto bg-card/95">
        <PrimaryButton
          className="flex-1"
          onClick={onCreateInterview}
          disabled={isCreating || questions.length === 0}
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" /> Create Interview
            </>
          )}
        </PrimaryButton>
        <Button variant="ghost" className="sm:flex-none" onClick={onClose} disabled={isCreating}>
          Cancel
        </Button>
      </div>
    </motion.div>
  );
};

export default FinalizeFormStep;
