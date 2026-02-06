import { motion } from "framer-motion";
import { Check, Search, PenTool, Sparkles, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ArchitectPhase = "context" | "structure" | "refine" | "finalize";

interface ArchitectPhaseIndicatorProps {
  currentPhase: ArchitectPhase;
  className?: string;
}

const phases: { id: ArchitectPhase; label: string; icon: React.ElementType }[] = [
  { id: "context", label: "Context", icon: Search },
  { id: "structure", label: "Structure", icon: PenTool },
  { id: "refine", label: "Refine", icon: Sparkles },
  { id: "finalize", label: "Finalize", icon: CheckCircle },
];

const ArchitectPhaseIndicator = ({ currentPhase, className }: ArchitectPhaseIndicatorProps) => {
  const currentIndex = phases.findIndex((p) => p.id === currentPhase);

  return (
    <div className={cn("flex items-center justify-center gap-1 sm:gap-2", className)}>
      {phases.map((phase, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = phase.icon;

        return (
          <div key={phase.id} className="flex items-center gap-1 sm:gap-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              {/* Icon indicator */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary/20 text-primary border-2 border-primary",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Label - hidden on mobile */}
              <span
                className={cn(
                  "hidden sm:block text-xs font-medium transition-colors",
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
                  "w-4 sm:w-8 h-0.5 transition-colors duration-300",
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

export default ArchitectPhaseIndicator;
