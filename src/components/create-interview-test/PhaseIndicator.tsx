import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type Phase = "discover" | "draft" | "refine" | "finalize";

interface PhaseIndicatorProps {
  currentPhase: Phase;
  className?: string;
}

const phases: { id: Phase; label: string }[] = [
  { id: "discover", label: "Discover" },
  { id: "draft", label: "Draft" },
  { id: "refine", label: "Refine" },
  { id: "finalize", label: "Finalize" },
];

const PhaseIndicator = ({ currentPhase, className }: PhaseIndicatorProps) => {
  const currentIndex = phases.findIndex((p) => p.id === currentPhase);

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {phases.map((phase, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={phase.id} className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              {/* Circle indicator */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary/20 text-primary border-2 border-primary",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Label - hidden on mobile */}
              <span
                className={cn(
                  "hidden sm:block text-sm font-medium transition-colors",
                  isCurrent && "text-primary",
                  isCompleted && "text-foreground",
                  !isCompleted && !isCurrent && "text-muted-foreground"
                )}
              >
                {phase.label}
              </span>
            </motion.div>

            {/* Connector line */}
            {index < phases.length - 1 && (
              <div
                className={cn(
                  "w-6 sm:w-12 h-0.5 transition-colors duration-300",
                  index < currentIndex ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PhaseIndicator;
