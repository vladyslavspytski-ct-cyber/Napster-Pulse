import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GripVertical,
  Pencil,
  Trash2,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type QuestionPhase = "opening" | "warmup" | "core" | "deepdive" | "closing";

export interface StructuredQuestion {
  id: string;
  text: string;
  phase: QuestionPhase;
  rationale?: string;
  alternatives?: string[];
  probes?: string[];
  sensitivityNote?: string;
}

const phaseConfig: Record<QuestionPhase, { label: string; color: string }> = {
  opening: { label: "Opening", color: "bg-blue-100 text-blue-700 border-blue-200" },
  warmup: { label: "Warm-up", color: "bg-amber-100 text-amber-700 border-amber-200" },
  core: { label: "Core", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  deepdive: { label: "Deep Dive", color: "bg-purple-100 text-purple-700 border-purple-200" },
  closing: { label: "Closing", color: "bg-slate-100 text-slate-700 border-slate-200" },
};

interface StructuredQuestionCardProps {
  question: StructuredQuestion;
  index: number;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

const StructuredQuestionCard = ({
  question,
  index,
  onEdit,
  onDelete,
  isDragging,
}: StructuredQuestionCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editText, setEditText] = useState(question.text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(question.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(question.text);
    setIsEditing(false);
  };

  const phase = phaseConfig[question.phase];
  const hasDetails = question.rationale || question.alternatives?.length || question.probes?.length || question.sensitivityNote;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group bg-card border border-border rounded-xl shadow-sm transition-all",
        isDragging && "shadow-lg border-primary/30 bg-card/95"
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag handle */}
          <div className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
            <GripVertical className="w-5 h-5" />
          </div>

          {/* Question number */}
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">{index + 1}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Phase badge */}
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={cn("text-xs", phase.color)}>
                {phase.label}
              </Badge>
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") handleCancel();
                  }}
                />
                <div className="flex gap-2">
                  <Button size="sm" variant="default" onClick={handleSave}>
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancel}>
                    <X className="w-3.5 h-3.5 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-foreground leading-relaxed">
                {question.text}
              </p>
            )}
          </div>

          {/* Actions */}
          {!isEditing && (
            <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:text-destructive"
                onClick={() => onDelete(question.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Expand/collapse details */}
        {hasDetails && !isEditing && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {isExpanded ? (
              <>
                Hide details <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Show rationale & alternatives <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {isExpanded && hasDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 space-y-3 border-t border-border/50 mt-2">
              {question.rationale && (
                <div className="flex items-start gap-2 pt-3">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Rationale</p>
                    <p className="text-xs text-muted-foreground">{question.rationale}</p>
                  </div>
                </div>
              )}

              {question.alternatives && question.alternatives.length > 0 && (
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Alternative Phrasings</p>
                    <ul className="space-y-1">
                      {question.alternatives.map((alt, i) => (
                        <li key={i} className="text-xs text-muted-foreground">• {alt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {question.probes && question.probes.length > 0 && (
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Follow-up Probes</p>
                    <ul className="space-y-1">
                      {question.probes.map((probe, i) => (
                        <li key={i} className="text-xs text-muted-foreground">→ {probe}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {question.sensitivityNote && (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Sensitivity Note</p>
                    <p className="text-xs text-muted-foreground">{question.sensitivityNote}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StructuredQuestionCard;
