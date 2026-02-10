import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, LayoutTemplate, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Template } from "@/hooks/api/useTemplates";

interface TemplatesPanelProps {
  templates: Template[];
  isLoading: boolean;
  error: Error | null;
  onSelectTemplate: (template: Template) => void;
  selectedTemplateId?: string;
  className?: string;
}

const TemplatesPanel = ({
  templates,
  isLoading,
  error,
  onSelectTemplate,
  selectedTemplateId,
  className,
}: TemplatesPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={cn("border-t border-border pt-4", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full justify-center"
      >
        <LayoutTemplate className="w-4 h-4" />
        <span>Interview Templates</span>
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
            <div className="pt-4 space-y-2">
              {isLoading && (
                <div className="flex items-center justify-center py-4 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span className="text-sm">Loading templates...</span>
                </div>
              )}

              {error && (
                <div className="text-center py-4 text-sm text-destructive">
                  Failed to load templates
                </div>
              )}

              {!isLoading && !error && templates.length === 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No templates available
                </div>
              )}

              {!isLoading &&
                !error &&
                templates.map((template) => {
                  const isSelected = selectedTemplateId === template.id;

                  return (
                    <Button
                      key={template.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => onSelectTemplate(template)}
                      className={cn(
                        "w-full h-auto py-3 px-4 justify-start text-left",
                        isSelected && "bg-primary text-primary-foreground"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {template.title}
                        </p>
                        <p
                          className={cn(
                            "text-xs truncate mt-0.5",
                            isSelected
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          )}
                        >
                          {template.questions.length} question
                          {template.questions.length !== 1 ? "s" : ""}
                          {template.scenario && ` \u2022 ${template.scenario.slice(0, 50)}${template.scenario.length > 50 ? "..." : ""}`}
                        </p>
                      </div>
                    </Button>
                  );
                })}
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-3">
              Select a template to start with pre-built questions
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplatesPanel;
