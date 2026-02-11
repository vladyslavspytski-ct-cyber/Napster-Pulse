import { useState } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import ArchitectPhaseIndicator, {
  ArchitectPhase,
} from "@/components/interview-architect/ArchitectPhaseIndicator";
import ArchitectAgentCard, {
  AgentState,
} from "@/components/interview-architect/ArchitectAgentCard";
import InterviewContextBadges, {
  InterviewContext,
} from "@/components/interview-architect/InterviewContextBadges";
import TemplatesPanel from "@/components/interview-architect/TemplatesPanel";
import StructuredQuestionCard, {
  StructuredQuestion,
} from "@/components/interview-architect/StructuredQuestionCard";
import ArchitectFinalizeModal from "@/components/interview-architect/ArchitectFinalizeModal";
import { useTemplates, Template } from "@/hooks/api/useTemplates";

/**
 * UI-only test version of the Interview Architect page.
 * Mirrors InterviewArchitectTest layout and design — no backend, no voice logic.
 */
const CreateInterviewTest = () => {
  const { templates, isLoading: templatesLoading, error: templatesError } = useTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [phase, setPhase] = useState<ArchitectPhase>("context");
  const [agentState, setAgentState] = useState<AgentState>("disconnected");
  const [mockInputLevel, setMockInputLevel] = useState(0);
  const [questions, setQuestions] = useState<StructuredQuestion[]>([]);
  const [interviewContext, setInterviewContext] = useState<InterviewContext>({});
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);

  // Simulated agent toggle — cycles through states visually only
  const handleAgentToggle = () => {
    if (agentState === "connecting" || agentState === "disconnecting") return;

    if (agentState === "disconnected") {
      setAgentState("connecting");
      setTimeout(() => {
        setAgentState("connected");
        // Simulate mock audio level
        const interval = setInterval(() => {
          setMockInputLevel(Math.random() * 0.7 + 0.1);
        }, 100);
        // Stop after 3 seconds
        setTimeout(() => {
          clearInterval(interval);
          setMockInputLevel(0);
          setAgentState("disconnecting");
          setTimeout(() => setAgentState("disconnected"), 300);
        }, 3000);
      }, 400);
    } else if (agentState === "connected") {
      setAgentState("disconnecting");
      setMockInputLevel(0);
      setTimeout(() => setAgentState("disconnected"), 300);
    }
  };

  const handleEditQuestion = (id: string, newText: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, text: newText } : q))
    );
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleReorder = (newOrder: StructuredQuestion[]) => {
    setQuestions(newOrder);
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    const sortedQuestions = [...template.questions].sort((a, b) => a.order - b.order);
    const structuredQuestions: StructuredQuestion[] = sortedQuestions.map((q) => ({
      id: q.id,
      text: q.text,
      phase: "core" as const,
    }));
    setQuestions(structuredQuestions);
    setPhase("structure");
    setAgentState("disconnected");
    setInterviewContext({
      type: template.title,
      goal: template.scenario || undefined,
    });
  };

  const handleFinalize = () => {
    setPhase("finalize");
    setShowFinalizeModal(true);
  };

  const handleReset = () => {
    setPhase("context");
    setAgentState("disconnected");
    setQuestions([]);
    setInterviewContext({});
    setMockInputLevel(0);
    setSelectedTemplate(null);
  };

  const getHelperText = () => {
    if (agentState === "connected") return "Listening... Tap to stop and process.";
    if (agentState === "connecting") return "Connecting to assistant...";
    if (agentState === "disconnecting") return "Processing your input...";
    if (questions.length > 0) return "Review the questions, or speak to add more";
    return "Tap to start speaking. Questions will appear as we talk.";
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
              <span className="text-sm font-medium text-primary">
                Interview Architect
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Voice-First Question Builder
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Speak naturally to design structured, expert-level interview
              questions
            </p>
          </div>

          {/* Phase Indicator */}
          <ArchitectPhaseIndicator currentPhase={phase} className="mb-6" />

          {/* Interview Context Badges */}
          <InterviewContextBadges
            context={interviewContext}
            className="justify-center mb-8"
          />

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
            {/* Left Column: Agent Card */}
            <div className="lg:col-span-4 space-y-4">
              <ArchitectAgentCard
                agentName="Interview Architect"
                agentDescription="I'll help you design structured, expert-level interview questions."
                state={agentState}
                helperText={getHelperText()}
                inputLevel={mockInputLevel}
                onToggle={handleAgentToggle}
              />

              {/* Reset button */}
              {(questions.length > 0 || selectedTemplate) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center"
                >
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Right Column: Question Cards - fixed height matching left column */}
            <div className="lg:col-span-8">
              <div className="glass-card rounded-2xl flex flex-col h-[420px] lg:h-[480px] overflow-hidden">
                {/* Sticky header */}
                <div className="flex items-center justify-between p-5 pb-3 flex-shrink-0">
                  <h3 className="text-sm font-medium text-foreground">
                    Question Sequence
                  </h3>
                  {questions.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {questions.length} question
                      {questions.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {/* Scrollable content area */}
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
                          <p className="text-muted-foreground text-sm mb-2">
                            Questions will appear here as you speak
                          </p>
                          <p className="text-muted-foreground/60 text-xs max-w-xs">
                            Start speaking to create your interview
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="questions"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="pb-2"
                        >
                          <Reorder.Group
                            axis="y"
                            values={questions}
                            onReorder={handleReorder}
                            className="space-y-3"
                          >
                            {questions.map((question, index) => (
                              <Reorder.Item
                                key={question.id}
                                value={question}
                                className="cursor-grab active:cursor-grabbing"
                              >
                                <StructuredQuestionCard
                                  question={question}
                                  index={index}
                                  onEdit={handleEditQuestion}
                                  onDelete={handleDeleteQuestion}
                                />
                              </Reorder.Item>
                            ))}
                          </Reorder.Group>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* Bottom fade overlay - scroll affordance */}
                  {questions.length > 3 && (
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card/90 to-transparent pointer-events-none rounded-b-2xl" />
                  )}
                </div>

                {/* Sticky footer CTA */}
                {questions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex-shrink-0 p-4 pt-3 border-t border-border/50 flex justify-center"
                  >
                    <PrimaryButton
                      onClick={handleFinalize}
                      className="px-8"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Finalize Questions
                    </PrimaryButton>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Templates Section - Full Width Below */}
          <div className="max-w-6xl mx-auto mt-8">
            <TemplatesPanel
              templates={templates}
              isLoading={templatesLoading}
              error={templatesError}
              onSelectTemplate={handleSelectTemplate}
              selectedTemplateId={selectedTemplate?.id}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Finalize Modal */}
      <ArchitectFinalizeModal
        isOpen={showFinalizeModal}
        onClose={() => setShowFinalizeModal(false)}
        questions={questions}
        interviewType={interviewContext.type}
        defaultTitle={selectedTemplate?.title}
      />
    </div>
  );
};

export default CreateInterviewTest;
