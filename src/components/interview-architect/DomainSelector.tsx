import { motion } from "framer-motion";
import { Briefcase, Newspaper, GraduationCap, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DomainPreset {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  constraints: string[];
  duration: string;
}

export const domainPresets: DomainPreset[] = [
  {
    id: "hr-exit",
    name: "HR Exit Interview",
    icon: Briefcase,
    description: "Retention insights, maintain positive relationship",
    constraints: ["30 min duration", "Keep relationship positive", "Identify retention factors"],
    duration: "30 min",
  },
  {
    id: "journalism",
    name: "Journalistic Source",
    icon: Newspaper,
    description: "Verification, legal sensitivity, nervous source",
    constraints: ["Build trust first", "Legal sensitivity", "Verify claims carefully"],
    duration: "45 min",
  },
  {
    id: "education",
    name: "Educational Assessment",
    icon: GraduationCap,
    description: "Rubric-aligned, scaffolding approach",
    constraints: ["10 min limit", "Rubric-aligned", "Age-appropriate scaffolding"],
    duration: "10 min",
  },
  {
    id: "manager-1on1",
    name: "Manager–Employee 1:1",
    icon: Users,
    description: "Development focus, address disengagement",
    constraints: ["Development focus", "Address disengagement", "Create action plan"],
    duration: "25 min",
  },
];

interface DomainSelectorProps {
  selectedDomain: DomainPreset | null;
  onSelect: (domain: DomainPreset) => void;
  disabled?: boolean;
}

const DomainSelector = ({ selectedDomain, onSelect, disabled }: DomainSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Choose Interview Type</h3>
        {selectedDomain && (
          <span className="text-xs text-primary font-medium">{selectedDomain.name}</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {domainPresets.map((domain, index) => {
          const Icon = domain.icon;
          const isSelected = selectedDomain?.id === domain.id;

          return (
            <motion.button
              key={domain.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => !disabled && onSelect(domain)}
              disabled={disabled}
              className={cn(
                "relative p-4 rounded-xl border text-left transition-all duration-200",
                "hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "bg-primary/5 border-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.3)]"
                  : "bg-card border-border",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    isSelected ? "bg-primary/10" : "bg-muted"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </div>
                <div className="min-w-0">
                  <h4
                    className={cn(
                      "font-medium text-sm leading-tight",
                      isSelected ? "text-primary" : "text-foreground"
                    )}
                  >
                    {domain.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {domain.description}
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                    {domain.duration}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default DomainSelector;
