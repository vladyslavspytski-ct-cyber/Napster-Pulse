import { useState, useMemo, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  Sparkles,
  RotateCcw,
  CheckCircle,
  LayoutTemplate,
  ArrowLeft,
} from "lucide-react";
import CreateInterviewVoiceAgentCard from "@/components/CreateInterviewVoiceAgentCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { findMockTemplateById } from "@/mock/templates";
import { getAllTemplates } from "@/mock/templatesDirectory";
import { findInterviewTypeById } from "@/mock/templatesDirectoryV2";

interface QuestionCard {
  id: string;
  text: string;
}

const CreateInterviewFromTemplate = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");

  // Try mock templates first, then directory v1, then directory v2
  const resolved = useMemo<{ title: string; questions: QuestionCard[] } | null>(() => {
    if (!templateId) return null;

    // Check mock/templates.ts first
    const mock = findMockTemplateById(templateId);
    if (mock) {
      const sorted = [...mock.questions].sort((a, b) => a.order - b.order);
      return { title: mock.title, questions: sorted.map((q) => ({ id: q.id, text: q.text })) };
    }

    // Fall back to directory v1 templates
    const all = getAllTemplates();
    const dir = all.find((t) => t.id === templateId);
    if (dir) {
      return {
        title: dir.title,
        questions: dir.questions.map((text, i) => ({ id: `${templateId}-q${i}`, text })),
      };
    }

    // Fall back to directory v2 templates
    const v2Type = findInterviewTypeById(templateId);
    if (v2Type) {
      return {
        title: v2Type.title,
        questions: v2Type.questions.map((q) => ({ id: q.id, text: q.text })),
      };
    }

    return null;
  }, [templateId]);

  const [questions, setQuestions] = useState<QuestionCard[]>(() => resolved?.questions ?? []);
  const [agentState, setAgentState] = useState<"disconnected" | "connecting" | "connected" | "disconnecting">("disconnected");

  const handleAgentToggle = useCallback(() => {
    if (agentState === "disconnected") {
      setAgentState("connecting");
      setTimeout(() => setAgentState("connected"), 1500);
    } else if (agentState === "connected") {
      setAgentState("disconnecting");
      setTimeout(() => setAgentState("disconnected"), 500);
    }
  }, [agentState]);

  const handleReorder = (newOrder: QuestionCard[]) => setQuestions(newOrder);
  const handleDeleteQuestion = (id: string) => setQuestions((prev) => prev.filter((q) => q.id !== id));
  const handleReset = () => {
    if (!resolved) return;
    setQuestions([...resolved.questions]);
  };

  // No template found state
  if (!resolved) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <LayoutTemplate className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {templateId ? "Template not found" : "No template selected"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Browse the template directory to pick one.
            </p>
            <Button variant="outline" asChild className="rounded-xl gap-2">
              <Link to="/templates">
                <ArrowLeft className="w-4 h-4" />
                Browse Templates
              </Link>
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="section-container">
          {/* Page Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Variant 2</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Create Interview
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Pre-filled from template — customize and finalize
            </p>
          </div>

          {/* Template badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-6"
          >
            <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-xs gap-2">
              <LayoutTemplate className="w-3.5 h-3.5" />
              Using: {resolved.title}
            </Badge>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
            {/* Left Column: Agent Card */}
            <div className="lg:col-span-4 space-y-4">
              <CreateInterviewVoiceAgentCard
                agentName="Interview Assistant"
                agentDescription="I'll help you customize these interview questions. Speak to edit, add, or reorder."
                state={agentState}
                inputLevel={0}
                outputLevel={0}
                onToggle={handleAgentToggle}
                errorMessage={null}
              />

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Original
                </Button>
              </motion.div>
            </div>

            {/* Right Column: Question Cards */}
            <div className="lg:col-span-8">
              <div className="glass-card rounded-2xl flex flex-col h-[420px] lg:h-[480px] overflow-hidden">
                <div className="flex items-center justify-between p-5 pb-3 flex-shrink-0">
                  <h3 className="text-sm font-medium text-foreground">Question Sequence</h3>
                  <span className="text-xs text-muted-foreground">
                    {questions.length} question{questions.length !== 1 ? "s" : ""}
                  </span>
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
                          <p className="text-muted-foreground text-sm">All questions removed</p>
                          <Button variant="ghost" size="sm" onClick={handleReset} className="mt-3">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Restore original questions
                          </Button>
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateInterviewFromTemplate;
