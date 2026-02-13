import { useState, useMemo } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  Sparkles,
  RotateCcw,
  CheckCircle,
  ChevronDown,
  LayoutTemplate,
  Search,
  Check,
  Loader2,
  Briefcase,
  Users,
  Heart,
  GraduationCap,
  Lightbulb,
  MessageCircle,
  Mic,
  Target,
  Compass,
  BookOpen,
  Shield,
  Zap,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MOCK_TEMPLATES, type MockTemplate } from "@/mock/templates";

/* ── Question card type (minimal) ── */
interface QuestionCard {
  id: string;
  text: string;
}

/* ── Icon palette for template cards ── */
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

const BATCH_SIZE = 12;

const CreateInterviewWithTemplates = () => {
  const [questions, setQuestions] = useState<QuestionCard[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MockTemplate | null>(null);

  // Templates panel state
  const [isTemplatesExpanded, setIsTemplatesExpanded] = useState(false);
  const [templateSearch, setTemplateSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const filtered = useMemo(() => {
    if (!templateSearch.trim()) return MOCK_TEMPLATES;
    const q = templateSearch.toLowerCase();
    return MOCK_TEMPLATES.filter(
      (t) => t.title.toLowerCase().includes(q) || t.scenario.toLowerCase().includes(q),
    );
  }, [templateSearch]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset visible on search change
  useMemo(() => setVisibleCount(BATCH_SIZE), [templateSearch]);

  const handleSelectTemplate = (template: MockTemplate) => {
    setSelectedTemplate(template);
    const sorted = [...template.questions].sort((a, b) => a.order - b.order);
    setQuestions(sorted.map((q) => ({ id: q.id, text: q.text })));
  };

  const handleReset = () => {
    setQuestions([]);
    setSelectedTemplate(null);
  };

  const handleReorder = (newOrder: QuestionCard[]) => {
    setQuestions(newOrder);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="section-container">
          {/* Page Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Variant 1</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Create Interview
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Embedded templates — select a template below to pre-fill questions
            </p>
          </div>

          {/* Selected template badge */}
          <AnimatePresence>
            {selectedTemplate && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex justify-center mb-6"
              >
                <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-xs gap-2">
                  <LayoutTemplate className="w-3.5 h-3.5" />
                  Using: {selectedTemplate.title}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content — Agent placeholder + Questions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
            {/* Left Column: Agent Card placeholder */}
            <div className="lg:col-span-4 space-y-4">
              <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center min-h-[280px]">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mic className="w-10 h-10 text-primary/40" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Voice agent placeholder
                </p>
                <p className="text-xs text-muted-foreground/60 text-center mt-1">
                  Select a template below to pre-fill questions
                </p>
              </div>

              {/* Reset */}
              {questions.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Right Column: Question Cards */}
            <div className="lg:col-span-8">
              <div className="glass-card rounded-2xl flex flex-col h-[420px] lg:h-[480px] overflow-hidden">
                <div className="flex items-center justify-between p-5 pb-3 flex-shrink-0">
                  <h3 className="text-sm font-medium text-foreground">Question Sequence</h3>
                  {questions.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {questions.length} question{questions.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-h-0 relative">
                  <div className="h-full overflow-y-auto custom-scrollbar px-5">
                    <AnimatePresence mode="wait">
                      {questions.length === 0 ? (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center py-16 text-center"
                        >
                          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-muted-foreground/50" />
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">No questions yet</p>
                          <p className="text-muted-foreground/60 text-xs max-w-xs">
                            Select a template below to pre-fill questions
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div key="questions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-2">
                          <Reorder.Group axis="y" values={questions} onReorder={handleReorder} className="space-y-3">
                            {questions.map((q, i) => (
                              <Reorder.Item key={q.id} value={q} className="cursor-grab active:cursor-grabbing">
                                <div className="glass-card rounded-xl p-4 flex items-start gap-3">
                                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {i + 1}
                                  </span>
                                  <p className="text-sm text-foreground flex-1">{q.text}</p>
                                  <button
                                    onClick={() => handleDeleteQuestion(q.id)}
                                    className="text-muted-foreground/40 hover:text-destructive transition-colors text-xs flex-shrink-0"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </Reorder.Item>
                            ))}
                          </Reorder.Group>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {questions.length > 3 && (
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card/90 to-transparent pointer-events-none rounded-b-2xl" />
                  )}
                </div>

                {questions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex-shrink-0 p-4 pt-3 border-t border-border/50 flex justify-center"
                  >
                    <PrimaryButton className="px-8">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Finalize Questions
                    </PrimaryButton>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* ── Templates Section — full width, collapsible ── */}
          <div className="max-w-6xl mx-auto mt-8">
            <button
              onClick={() => setIsTemplatesExpanded((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 glass-card rounded-2xl hover:bg-muted/30 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <LayoutTemplate className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-foreground">Templates</h3>
                  <p className="text-[11px] text-muted-foreground">{MOCK_TEMPLATES.length} available</p>
                </div>
              </div>
              <motion.div animate={{ rotate: isTemplatesExpanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isTemplatesExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-4 px-1">
                    {/* Search */}
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input
                        value={templateSearch}
                        onChange={(e) => setTemplateSearch(e.target.value)}
                        placeholder="Search templates..."
                        className="pl-9 h-9 text-sm bg-muted/50 border-border/50 rounded-xl"
                      />
                    </div>

                    {/* Empty */}
                    {filtered.length === 0 && (
                      <div className="text-center py-12 text-sm text-muted-foreground">
                        {templateSearch ? "No matching templates" : "No templates available"}
                      </div>
                    )}

                    {/* Grid */}
                    {filtered.length > 0 && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {visible.map((template, i) => {
                            const isSelected = selectedTemplate?.id === template.id;
                            const visual = ICON_MAP[template.seq % ICON_MAP.length];
                            const IconComp = visual.icon;

                            return (
                              <motion.button
                                key={template.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                                onClick={() => handleSelectTemplate(template)}
                                className={cn(
                                  "w-full text-left rounded-xl p-4 transition-all duration-200 glass-card",
                                  isSelected ? "ring-2 ring-primary/30 shadow-md" : "hover:shadow-sm hover:border-border",
                                )}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={cn("w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0", visual.accent)}>
                                    <IconComp className={cn("w-4 h-4", visual.text)} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className={cn("text-sm font-medium truncate", isSelected ? "text-primary" : "text-foreground")}>
                                        {template.title}
                                      </p>
                                      {isSelected && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                      {template.scenario}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                                      {template.questions.length} question{template.questions.length !== 1 ? "s" : ""}
                                    </p>
                                  </div>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>

                        {hasMore && (
                          <div className="flex justify-center pt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setVisibleCount((v) => v + BATCH_SIZE)}
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateInterviewWithTemplates;
