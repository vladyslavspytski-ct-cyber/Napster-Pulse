import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, X, Download, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StructuredQuestion, QuestionPhase } from "./StructuredQuestionCard";
import { cn } from "@/lib/utils";

interface ArchitectFinalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: StructuredQuestion[];
  interviewType?: string;
}

const phaseConfig: Record<QuestionPhase, { label: string; color: string }> = {
  opening: { label: "Opening", color: "bg-blue-100 text-blue-700" },
  warmup: { label: "Warm-up", color: "bg-amber-100 text-amber-700" },
  core: { label: "Core", color: "bg-emerald-100 text-emerald-700" },
  deepdive: { label: "Deep Dive", color: "bg-purple-100 text-purple-700" },
  closing: { label: "Closing", color: "bg-slate-100 text-slate-700" },
};

const ArchitectFinalizeModal = ({
  isOpen,
  onClose,
  questions,
  interviewType,
}: ArchitectFinalizeModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = questions
      .map((q, i) => `${i + 1}. [${phaseConfig[q.phase].label}] ${q.text}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Group questions by phase
  const groupedQuestions = questions.reduce((acc, q) => {
    if (!acc[q.phase]) acc[q.phase] = [];
    acc[q.phase].push(q);
    return acc;
  }, {} as Record<QuestionPhase, StructuredQuestion[]>);

  const phaseOrder: QuestionPhase[] = ["opening", "warmup", "core", "deepdive", "closing"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] overflow-hidden z-50"
          >
            <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-interu-mint-light flex items-center justify-center">
                    <FileText className="w-5 h-5 text-interu-mint" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Interview Ready!
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {questions.length} questions • {interviewType || "Custom Interview"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Questions list by phase */}
              <div className="p-5 max-h-[50vh] overflow-y-auto space-y-6">
                {phaseOrder.map((phase) => {
                  const phaseQuestions = groupedQuestions[phase];
                  if (!phaseQuestions?.length) return null;

                  return (
                    <div key={phase}>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className={cn("text-xs", phaseConfig[phase].color)}>
                          {phaseConfig[phase].label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {phaseQuestions.length} question{phaseQuestions.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {phaseQuestions.map((question, index) => (
                          <motion.div
                            key={question.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="flex items-start gap-3 p-3 rounded-xl bg-muted/50"
                          >
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                              {questions.findIndex((q) => q.id === question.id) + 1}
                            </span>
                            <p className="text-sm text-foreground">{question.text}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-border flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All
                    </>
                  )}
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="ghost" className="sm:flex-none" onClick={onClose}>
                  Close
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
