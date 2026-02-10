import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LayoutTemplate, Loader2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return templates;
    const q = search.toLowerCase();
    return templates.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.scenario && t.scenario.toLowerCase().includes(q))
    );
  }, [templates, search]);

  return (
    <div className={cn("glass-card rounded-2xl overflow-hidden", className)}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <LayoutTemplate className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Templates</h3>
            <p className="text-[11px] text-muted-foreground">
              {templates.length} available
            </p>
          </div>
        </div>

        {/* Search */}
        {templates.length > 3 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="pl-9 h-9 text-sm bg-muted/50 border-border/50 rounded-xl"
            />
          </div>
        )}
      </div>

      {/* List */}
      <div className="px-3 pb-3 max-h-[280px] overflow-y-auto custom-scrollbar">
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span className="text-sm">Loading...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-sm text-destructive">
            Failed to load templates
          </div>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            {search ? "No matching templates" : "No templates available"}
          </div>
        )}

        {!isLoading &&
          !error &&
          filtered.map((template, i) => {
            const isSelected = selectedTemplateId === template.id;

            return (
              <motion.button
                key={template.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => onSelectTemplate(template)}
                className={cn(
                  "w-full text-left rounded-xl px-4 py-3 mb-1.5 transition-all duration-200",
                  "border border-transparent",
                  isSelected
                    ? "bg-primary/10 border-primary/20 shadow-sm"
                    : "hover:bg-muted/60"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          isSelected ? "text-primary" : "text-foreground"
                        )}
                      >
                        {template.title}
                      </p>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      )}
                    </div>
                    {template.scenario && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                        {template.scenario}
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground/70 mt-1">
                      {template.questions.length} question
                      {template.questions.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
      </div>
    </div>
  );
};

export default TemplatesPanel;
