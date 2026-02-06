import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Beaker, Briefcase, Newspaper, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DemoPreset {
  id: string;
  name: string;
  icon: React.ElementType;
  shortDescription: string;
}

export const demoPresets: DemoPreset[] = [
  {
    id: "hr-exit",
    name: "HR Exit Interview",
    icon: Briefcase,
    shortDescription: "Retention insights, 30 min",
  },
  {
    id: "journalism",
    name: "Journalistic Source",
    icon: Newspaper,
    shortDescription: "Verification, sensitive",
  },
  {
    id: "education",
    name: "Educational Assessment",
    icon: GraduationCap,
    shortDescription: "10 min, scaffolded",
  },
  {
    id: "manager-1on1",
    name: "Manager 1:1",
    icon: Users,
    shortDescription: "Development focus",
  },
];

interface DemoPresetsPanelProps {
  onSelectPreset: (presetId: string) => void;
  selectedPresetId?: string;
  className?: string;
}

const DemoPresetsPanel = ({ onSelectPreset, selectedPresetId, className }: DemoPresetsPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn("border-t border-border pt-4", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full justify-center"
      >
        <Beaker className="w-4 h-4" />
        <span>Demo Presets</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 grid grid-cols-2 gap-2">
              {demoPresets.map((preset) => {
                const Icon = preset.icon;
                const isSelected = selectedPresetId === preset.id;

                return (
                  <Button
                    key={preset.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelectPreset(preset.id)}
                    className={cn(
                      "h-auto py-2 px-3 justify-start text-left",
                      isSelected && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{preset.name}</p>
                      <p className={cn(
                        "text-[10px] truncate",
                        isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {preset.shortDescription}
                      </p>
                    </div>
                  </Button>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-3">
              Load example scenarios to explore the question builder
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DemoPresetsPanel;
