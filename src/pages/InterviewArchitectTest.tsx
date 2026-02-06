import { useState, useEffect } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import ArchitectPhaseIndicator, { ArchitectPhase } from "@/components/interview-architect/ArchitectPhaseIndicator";
import VoiceSessionPanel, { VoiceState } from "@/components/interview-architect/VoiceSessionPanel";
import InterviewContextBadges, { InterviewContext } from "@/components/interview-architect/InterviewContextBadges";
import DemoPresetsPanel from "@/components/interview-architect/DemoPresetsPanel";
import StructuredQuestionCard, { StructuredQuestion } from "@/components/interview-architect/StructuredQuestionCard";
import ArchitectFinalizeModal from "@/components/interview-architect/ArchitectFinalizeModal";

// Mock data by preset
const mockDataByPreset: Record<string, {
  context: InterviewContext;
  prompts: string[];
  questions: StructuredQuestion[];
}> = {
  "hr-exit": {
    context: {
      type: "HR Exit Interview",
      goal: "Retention insights",
      duration: "30 min",
      tone: "Supportive",
    },
    prompts: [
      "What's prompting this exit interview? Tell me about the employee.",
      "I see — a 3-year tenure, voluntary departure. Let me design questions that balance honest feedback with relationship preservation.",
      "I've structured a 6-question flow. Feel free to reorder or edit these.",
    ],
    questions: [
      {
        id: "1",
        text: "Before we begin, I want you to know this conversation is confidential. How are you feeling about your transition?",
        phase: "opening",
        rationale: "Establishes psychological safety and acknowledges the emotional weight of leaving.",
        sensitivityNote: "Some employees may be emotional; give space for processing.",
      },
      {
        id: "2",
        text: "What initially attracted you to this role, and how did your experience compare to those expectations?",
        phase: "warmup",
        rationale: "Surfaces the gap between expectations and reality without being confrontational.",
        alternatives: ["What drew you to join us originally?", "How did the role match what you imagined?"],
      },
      {
        id: "3",
        text: "If you could change one thing about your day-to-day experience here, what would it be?",
        phase: "core",
        rationale: "Focuses on actionable, specific feedback rather than vague dissatisfaction.",
        probes: ["Can you give me a specific example?", "How did that affect your motivation?"],
      },
      {
        id: "4",
        text: "How would you describe your relationship with your direct manager?",
        phase: "core",
        rationale: "Manager relationship is the #1 predictor of retention.",
        sensitivityNote: "Avoid leading questions; let them share freely.",
      },
      {
        id: "5",
        text: "What could we have done differently to keep you on the team?",
        phase: "deepdive",
        rationale: "Direct question that often yields the most actionable insight.",
        alternatives: ["Was there a specific moment when you decided to leave?"],
      },
      {
        id: "6",
        text: "What advice would you give to your successor?",
        phase: "closing",
        rationale: "Shifts focus to constructive forward-looking perspective.",
      },
    ],
  },
  journalism: {
    context: {
      type: "Journalistic Source",
      goal: "Verify claims",
      duration: "45 min",
      tone: "Trust-building",
    },
    prompts: [
      "This sounds sensitive. Is the source a whistleblower or witness?",
      "High-stakes situation with a whistleblower on deep background. I'll prioritize trust-building and verification.",
      "Here's a structured approach with sensitivity notes for each question.",
    ],
    questions: [
      {
        id: "1",
        text: "Thank you for agreeing to speak with me. Can you start by telling me about your background and how you came to have knowledge of this situation?",
        phase: "opening",
        rationale: "Establishes credibility and context for their knowledge.",
        sensitivityNote: "Source may be nervous; reassure about confidentiality.",
      },
      {
        id: "2",
        text: "In your own words, what happened?",
        phase: "warmup",
        rationale: "Open-ended prompt allows source to tell their story without leading.",
        probes: ["When did this occur?", "Who else was present?"],
      },
      {
        id: "3",
        text: "Do you have any documentation, emails, or records that support what you've described?",
        phase: "core",
        rationale: "Verification is essential; tangible evidence strengthens the story.",
      },
      {
        id: "4",
        text: "Who else can corroborate this account?",
        phase: "core",
        rationale: "Multiple sources strengthen credibility and reduce legal risk.",
      },
      {
        id: "5",
        text: "Why are you choosing to share this now?",
        phase: "deepdive",
        rationale: "Helps assess motivation and potential bias.",
        sensitivityNote: "Be empathetic; sources often take significant risk.",
      },
      {
        id: "6",
        text: "Is there anything you're not comfortable with me publishing, or any conditions on how this information is used?",
        phase: "closing",
        rationale: "Clarifies ground rules and protects both parties legally.",
      },
    ],
  },
  education: {
    context: {
      type: "Educational Assessment",
      goal: "Check understanding",
      duration: "10 min",
      tone: "Encouraging",
    },
    prompts: [
      "What subject and grade level? Is this formative or summative?",
      "8th grade photosynthesis, formative check. I'll scaffold from recall to application.",
      "Here's a quick 6-question flow aligned to Bloom's taxonomy.",
    ],
    questions: [
      {
        id: "1",
        text: "Let's start with something easy. Can you tell me what subject we're going to talk about today?",
        phase: "opening",
        rationale: "Confirms topic and eases student into the assessment.",
      },
      {
        id: "2",
        text: "In your own words, what is the main idea of what we learned this week?",
        phase: "warmup",
        rationale: "Assesses comprehension at a conceptual level before details.",
        alternatives: ["Can you summarize what we studied?"],
      },
      {
        id: "3",
        text: "Can you give me an example of how this concept works in real life?",
        phase: "core",
        rationale: "Tests application and transfer of knowledge.",
        probes: ["Why does that example fit?", "Can you think of another one?"],
      },
      {
        id: "4",
        text: "What was the most confusing part for you, and how did you work through it?",
        phase: "core",
        rationale: "Assesses metacognition and self-regulation.",
      },
      {
        id: "5",
        text: "If you were the teacher, how would you explain this to someone who doesn't understand it yet?",
        phase: "deepdive",
        rationale: "Teaching others is the highest level of understanding.",
      },
      {
        id: "6",
        text: "What's one thing you want to learn more about related to this topic?",
        phase: "closing",
        rationale: "Fosters curiosity and identifies future learning goals.",
      },
    ],
  },
  "manager-1on1": {
    context: {
      type: "Manager 1:1",
      goal: "Address disengagement",
      duration: "25 min",
      tone: "Caring",
    },
    prompts: [
      "Tell me about the signs of disengagement you're seeing.",
      "Gradual disengagement over a month with a newer report. Could be burnout or role misfit.",
      "I'll structure questions that start with care before addressing concerns.",
    ],
    questions: [
      {
        id: "1",
        text: "How are you doing this week—not just work, but overall?",
        phase: "opening",
        rationale: "Shows genuine care and opens door for personal context.",
      },
      {
        id: "2",
        text: "What's been your biggest win since we last talked?",
        phase: "warmup",
        rationale: "Starts positive and builds confidence before harder topics.",
      },
      {
        id: "3",
        text: "What's getting in the way of you doing your best work right now?",
        phase: "core",
        rationale: "Surfaces blockers and frustrations directly.",
        probes: ["Is this a recurring issue?", "What would help?"],
      },
      {
        id: "4",
        text: "How are you feeling about your career trajectory here?",
        phase: "core",
        rationale: "Addresses long-term engagement and growth.",
        sensitivityNote: "Employee may not feel safe being honest; create space.",
      },
      {
        id: "5",
        text: "Is there anything I'm doing—or not doing—that's making your job harder?",
        phase: "deepdive",
        rationale: "Models vulnerability and invites honest feedback on management.",
      },
      {
        id: "6",
        text: "What's one thing you want to accomplish before our next check-in?",
        phase: "closing",
        rationale: "Creates accountability and a clear action item.",
      },
    ],
  },
};

const InterviewArchitectTest = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [phase, setPhase] = useState<ArchitectPhase>("context");
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [questions, setQuestions] = useState<StructuredQuestion[]>([]);
  const [interviewContext, setInterviewContext] = useState<InterviewContext>({});
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const currentData = selectedPresetId ? mockDataByPreset[selectedPresetId] : null;
  const currentPrompt = currentData?.prompts[currentPromptIndex] || "Describe the interview you want to create. I'll help design the perfect questions.";

  // Handle preset selection
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setPhase("context");
    setVoiceState("idle");
    setCurrentPromptIndex(0);
    setQuestions([]);
    setInterviewContext({});
    setDemoStep(0);
  };

  // Simulate voice interaction progression
  const handleVoiceToggle = () => {
    if (voiceState === "thinking" || voiceState === "suggesting") return;

    if (voiceState === "idle") {
      setVoiceState("listening");
      
      // Simulate listening for 2 seconds
      setTimeout(() => {
        setVoiceState("thinking");
        
        // Simulate thinking for 1.5 seconds
        setTimeout(() => {
          advanceDemo();
        }, 1500);
      }, 2000);
    } else if (voiceState === "listening") {
      // User stopped speaking early
      setVoiceState("thinking");
      setTimeout(() => {
        advanceDemo();
      }, 1500);
    }
  };

  const advanceDemo = () => {
    if (!currentData) {
      setVoiceState("idle");
      return;
    }

    const newStep = demoStep + 1;
    setDemoStep(newStep);

    if (newStep === 1) {
      // After first interaction, show context
      setInterviewContext(currentData.context);
      setPhase("context");
      setCurrentPromptIndex(1);
      setVoiceState("idle");
    } else if (newStep === 2) {
      // After second interaction, show structure phase and start suggesting
      setPhase("structure");
      setVoiceState("suggesting");
      setCurrentPromptIndex(2);
      
      // Add questions one by one
      currentData.questions.forEach((q, i) => {
        setTimeout(() => {
          setQuestions((prev) => [...prev, { ...q, id: `${Date.now()}-${i}` }]);
          if (i === currentData.questions.length - 1) {
            setTimeout(() => {
              setVoiceState("idle");
              setPhase("refine");
            }, 500);
          }
        }, i * 400);
      });
    } else {
      // Subsequent interactions just cycle the prompt
      setVoiceState("idle");
    }
  };

  // Question handlers
  const handleEditQuestion = (id: string, newText: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, text: newText } : q))
    );
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleFinalize = () => {
    setPhase("finalize");
    setShowFinalizeModal(true);
  };

  const handleReset = () => {
    setSelectedPresetId(null);
    setPhase("context");
    setVoiceState("idle");
    setCurrentPromptIndex(0);
    setQuestions([]);
    setInterviewContext({});
    setDemoStep(0);
  };

  const getHelperText = () => {
    if (demoStep === 0) return "Tell me about your interview goals and constraints";
    if (demoStep === 1) return "Share more details to refine the questions";
    if (questions.length > 0) return "Review the questions, or speak to refine them";
    return undefined;
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
              <span className="text-sm font-medium text-primary">Interview Architect</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Voice-First Question Builder
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Speak naturally to design structured, expert-level interview questions
            </p>
          </div>

          {/* Phase Indicator */}
          <ArchitectPhaseIndicator currentPhase={phase} className="mb-6" />

          {/* Interview Context Badges */}
          <InterviewContextBadges context={interviewContext} className="justify-center mb-8" />

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
            {/* Left Column: Voice Session */}
            <div className="lg:col-span-4 space-y-4">
              <VoiceSessionPanel
                voiceState={voiceState}
                currentPrompt={currentPrompt}
                helperText={getHelperText()}
                onToggleVoice={handleVoiceToggle}
              />

              {/* Reset button */}
              {(questions.length > 0 || selectedPresetId) && (
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

              {/* Demo Presets - Secondary Area */}
              <DemoPresetsPanel
                onSelectPreset={handleSelectPreset}
                selectedPresetId={selectedPresetId || undefined}
              />
            </div>

            {/* Right Column: Question Cards */}
            <div className="lg:col-span-8">
              <div className="glass-card rounded-2xl p-5 min-h-[400px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-foreground">
                    Question Sequence
                  </h3>
                  {questions.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {questions.length} question{questions.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {/* Empty State */}
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
                        {selectedPresetId 
                          ? "Tap the microphone to start the conversation"
                          : "Select a demo preset below or start speaking to create your interview"
                        }
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="questions"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Reorder.Group
                        axis="y"
                        values={questions}
                        onReorder={setQuestions}
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

                      {/* Finalize CTA */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 flex justify-center"
                      >
                        <PrimaryButton onClick={handleFinalize} className="px-8">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Finalize Questions
                        </PrimaryButton>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
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
      />
    </div>
  );
};

export default InterviewArchitectTest;
