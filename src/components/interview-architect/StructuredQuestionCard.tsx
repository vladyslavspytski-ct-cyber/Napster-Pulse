import { useState } from "react";
import { motion } from "framer-motion";
import {
  GripVertical,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      </div>
    </motion.div>
  );
};

export default StructuredQuestionCard;
