import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutTemplate,
  Loader2,
  Check,
  ChevronDown,
  Briefcase,
  GraduationCap,
  Heart,
  Lightbulb,
  MessageCircle,
  Mic,
  Users,
  Target,
  Compass,
  BookOpen,
  Shield,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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

const BATCH_SIZE = 12;

// Deterministic icon + accent color based on seq (mod-based)
const ICON_MAP = [
  { icon: Briefcase, accent: "from-blue-400/20 to-blue-500/10", text: "text-blue-500" },
  { icon: Users, accent: "from-violet-400/20 to-violet-500/10", text: "text-violet-500" },
  { icon: Heart, accent: "from-rose-400/20 to-rose-500/10", text: "text-rose-500" },
  { icon: GraduationCap, accent: "from-emerald-400/20 to-emerald-500/10", text: "text-emerald-500" },
  { icon: Lightbulb, accent: "from-amber-400/20 to-amber-500/10", text: "text-amber-500" },
  { icon: MessageCircle, accent: "from-cyan-400/20 to-cyan-500/10", text: "text-cyan-500" },
  { icon: Mic, accent: "from-pink-400/20 to-pink-500/10", text: "text-pink-500" },
  { icon: Target, accent: "from-orange-400/20 to-orange-500/10", text: "text-orange-500" },
  { icon: Compass, accent: "from-teal-400/20 to-teal-500/10", text: "text-teal-500" },
  { icon: BookOpen, accent: "from-indigo-400/20 to-indigo-500/10", text: "text-indigo-500" },
  { icon: Shield, accent: "from-slate-400/20 to-slate-500/10", text: "text-slate-500" },
  { icon: Zap, accent: "from-yellow-400/20 to-yellow-500/10", text: "text-yellow-500" },
];

function getIconForTemplate(seq: number) {
  return ICON_MAP[seq % ICON_MAP.length];
}

const TemplatesPanel = ({
  templates,
  isLoading,
  error,
  onSelectTemplate,
  selectedTemplateId,
  className,
}: TemplatesPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const filtered = useMemo(() => {
    if (!search.trim()) return templates;
    const q = search.toLowerCase();
    return templates.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.scenario && t.scenario.toLowerCase().includes(q))
    );
  }, [templates, search]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + BATCH_SIZE);
  };

  // Reset visible count when search changes
  useMemo(() => {
    setVisibleCount(BATCH_SIZE);
  }, [search]);

  return (
    <div className={cn("w-full", className)}>
      {/* Collapse trigger */}
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 glass-card rounded-2xl hover:bg-muted/30 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <LayoutTemplate className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-foreground">Templates</h3>
            <p className="text-[11px] text-muted-foreground">
              {templates.length} available
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </motion.div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {/* Search */}
              {templates.length > 3 && (
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search templates..."
                    className="pl-9 h-9 text-sm bg-muted/50 border-border/50 rounded-xl"
                  />
                </div>
              )}

              {/* Loading */}
              {isLoading && (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span className="text-sm">Loading templates...</span>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="text-center py-12 text-sm text-destructive">
                  Failed to load templates
                </div>
              )}

              {/* Empty */}
              {!isLoading && !error && filtered.length === 0 && (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  {search ? "No matching templates" : "No templates available"}
                </div>
              )}

              {/* Grid */}
              {!isLoading && !error && filtered.length > 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {visible.map((template, i) => {
                      const isSelected = selectedTemplateId === template.id;
                      const visual = getIconForTemplate(template.seq);
                      const IconComp = visual.icon;

                      return (
                        <motion.button
                          key={template.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(i * 0.03, 0.3) }}
                          onClick={() => onSelectTemplate(template)}
                          className={cn(
                            "w-full text-left rounded-xl p-4 transition-all duration-200",
                            "glass-card",
                            isSelected
                              ? "ring-2 ring-primary/30 shadow-md"
                              : "hover:shadow-sm hover:border-border"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon badge */}
                            <div
                              className={cn(
                                "w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                                visual.accent
                              )}
                            >
                              <IconComp className={cn("w-4 h-4", visual.text)} />
                            </div>

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
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                  {template.scenario}
                                </p>
                              )}
                              <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                                {template.questions.length} question
                                {template.questions.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Load more */}
                  {hasMore && (
                    <div className="flex justify-center pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLoadMore}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Load more ({filtered.length - visibleCount} remaining)
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplatesPanel;
