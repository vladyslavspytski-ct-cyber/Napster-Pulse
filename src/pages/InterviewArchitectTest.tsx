import { useState, useRef, useEffect } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import DomainSelector, { DomainPreset, domainPresets } from "@/components/interview-architect/DomainSelector";
import ArchitectPhaseIndicator, { ArchitectPhase } from "@/components/interview-architect/ArchitectPhaseIndicator";
import ArchitectConversation, { ArchitectMessage } from "@/components/interview-architect/ArchitectConversation";
import ArchitectVoiceOrb from "@/components/interview-architect/ArchitectVoiceOrb";
import StructuredQuestionCard, { StructuredQuestion } from "@/components/interview-architect/StructuredQuestionCard";
import ArchitectFinalizeModal from "@/components/interview-architect/ArchitectFinalizeModal";

// Mock question sets by domain
const mockQuestionsByDomain: Record<string, StructuredQuestion[]> = {
  "hr-exit": [
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
  journalism: [
    {
      id: "1",
      text: "Thank you for agreeing to speak with me. Can you start by telling me a bit about your background and how you came to have knowledge of this situation?",
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
  education: [
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
  "manager-1on1": [
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
};

// Mock conversation scripts by domain
const mockConversationsByDomain: Record<string, ArchitectMessage[]> = {
  "hr-exit": [
    { id: "1", role: "system", content: "Interview Architect started", timestamp: new Date() },
    { id: "2", role: "assistant", content: "I see you're conducting an HR Exit Interview. These are delicate conversations—the goal is to gather honest feedback while maintaining a positive relationship.\n\nA few quick questions to tailor the questions:", timestamp: new Date() },
    { id: "3", role: "assistant", content: "1. Is this employee leaving voluntarily or was this a layoff?\n2. How long were they with the company?\n3. Are they going to a competitor?", timestamp: new Date() },
    { id: "4", role: "user", content: "Voluntary resignation, 3 years with us, going to a startup in a different industry.", timestamp: new Date() },
    { id: "5", role: "assistant", content: "Got it—a 3-year tenure with voluntary departure to a non-competitor. This gives us room for honest, forward-looking questions.\n\nI've structured a 6-question sequence following best practices:\n\n• Opening: Psychological safety\n• Warm-up: Expectations vs. reality\n• Core: Specific feedback on experience and management\n• Deep Dive: Retention opportunity\n• Closing: Constructive advice\n\nI'm generating the questions now. Feel free to reorder, edit, or ask me to suggest alternatives.", timestamp: new Date() },
    { id: "6", role: "system", content: "Questions generated based on context", timestamp: new Date() },
  ],
  journalism: [
    { id: "1", role: "system", content: "Interview Architect started", timestamp: new Date() },
    { id: "2", role: "assistant", content: "Journalistic source interviews require careful handling—especially with legal sensitivity and a nervous source.\n\nLet me understand the situation better:", timestamp: new Date() },
    { id: "3", role: "assistant", content: "1. Is this source a whistleblower or a direct witness?\n2. What level of confidentiality have you agreed to?\n3. Is there potential legal jeopardy for the source?", timestamp: new Date() },
    { id: "4", role: "user", content: "Whistleblower, deep background only, yes they could face retaliation.", timestamp: new Date() },
    { id: "5", role: "assistant", content: "Understood—high-stakes situation with a whistleblower on deep background.\n\nI'll prioritize:\n• Building trust quickly in the opening\n• Verification and documentation in the core\n• Understanding motivation (helps assess credibility)\n• Clear ground rules to protect the source\n\nGenerating a 6-question structure now. The sensitivity notes are especially important here.", timestamp: new Date() },
    { id: "6", role: "system", content: "Questions generated with sensitivity notes", timestamp: new Date() },
  ],
  education: [
    { id: "1", role: "system", content: "Interview Architect started", timestamp: new Date() },
    { id: "2", role: "assistant", content: "An educational assessment in 10 minutes—we need to be efficient while still scaffolding properly.\n\nQuick questions:", timestamp: new Date() },
    { id: "3", role: "assistant", content: "1. What grade level is the student?\n2. What subject/topic are we assessing?\n3. Is this formative (learning check) or summative (graded)?", timestamp: new Date() },
    { id: "4", role: "user", content: "8th grade, photosynthesis unit, formative check-in.", timestamp: new Date() },
    { id: "5", role: "assistant", content: "Perfect—8th grade formative assessment on photosynthesis. I'll use age-appropriate scaffolding and focus on comprehension + application.\n\nThe structure will progress from:\n• Recall → Comprehension → Application → Analysis → Metacognition\n\nThis aligns with Bloom's taxonomy while staying within your 10-minute limit. Generating questions now.", timestamp: new Date() },
    { id: "6", role: "system", content: "Rubric-aligned questions generated", timestamp: new Date() },
  ],
  "manager-1on1": [
    { id: "1", role: "system", content: "Interview Architect started", timestamp: new Date() },
    { id: "2", role: "assistant", content: "Manager–Employee 1:1s are critical for engagement and retention. You mentioned there may be disengagement to address.\n\nA few things that will help me tailor the questions:", timestamp: new Date() },
    { id: "3", role: "assistant", content: "1. How long have you managed this person?\n2. What signs of disengagement are you seeing?\n3. Is there a specific incident, or gradual decline?", timestamp: new Date() },
    { id: "4", role: "user", content: "6 months, they've been quieter in meetings and missing deadlines. Gradual over the last month.", timestamp: new Date() },
    { id: "5", role: "assistant", content: "Thanks—gradual disengagement over a month with a relatively new report. This could be burnout, personal issues, or role misalignment.\n\nI'll structure questions that:\n• Start with genuine care (not accusatory)\n• Celebrate wins before addressing concerns\n• Create space for honest feedback about your management\n• End with a concrete action item\n\nGenerating the sequence now.", timestamp: new Date() },
    { id: "6", role: "system", content: "Development-focused questions generated", timestamp: new Date() },
  ],
};

const InterviewArchitectTest = () => {
  const [selectedDomain, setSelectedDomain] = useState<DomainPreset | null>(null);
  const [phase, setPhase] = useState<ArchitectPhase>("context");
  const [messages, setMessages] = useState<ArchitectMessage[]>([]);
  const [questions, setQuestions] = useState<StructuredQuestion[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  
  const conversationRef = useRef<HTMLDivElement>(null);

  // Auto-scroll conversation
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle domain selection
  const handleDomainSelect = (domain: DomainPreset) => {
    setSelectedDomain(domain);
    setPhase("context");
    setMessages([]);
    setQuestions([]);
    setDemoStep(0);
  };

  // Simulate demo progression
  const advanceDemo = () => {
    if (!selectedDomain) return;

    const domainMessages = mockConversationsByDomain[selectedDomain.id] || [];
    const domainQuestions = mockQuestionsByDomain[selectedDomain.id] || [];

    if (demoStep < domainMessages.length) {
      // Add next message
      const nextMessage = { ...domainMessages[demoStep], timestamp: new Date() };
      setMessages((prev) => [...prev, nextMessage]);

      // Update phase based on progress
      if (demoStep === 0) setPhase("context");
      if (demoStep === 4) setPhase("structure");
      if (demoStep >= 5) setPhase("refine");

      // Add questions when appropriate
      if (demoStep === 5) {
        // Simulate questions appearing one by one
        domainQuestions.forEach((q, i) => {
          setTimeout(() => {
            setQuestions((prev) => [...prev, { ...q, id: `${Date.now()}-${i}` }]);
          }, i * 300);
        });
      }

      setDemoStep((prev) => prev + 1);
    }
  };

  // Voice toggle simulation
  const handleVoiceToggle = () => {
    if (isProcessing) return;

    if (!isListening) {
      setIsListening(true);
      // Simulate listening for 2 seconds
      setTimeout(() => {
        setIsListening(false);
        setIsProcessing(true);
        // Simulate processing for 1 second then advance demo
        setTimeout(() => {
          setIsProcessing(false);
          advanceDemo();
        }, 1000);
      }, 2000);
    } else {
      setIsListening(false);
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
    setSelectedDomain(null);
    setPhase("context");
    setMessages([]);
    setQuestions([]);
    setDemoStep(0);
    setIsListening(false);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="section-container">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Interview Architect</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              AI-Powered Question Builder
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              An expert assistant that guides you through creating structured, thoughtful interview questions tailored to your specific context.
            </p>
          </div>

          {/* Phase Indicator */}
          <ArchitectPhaseIndicator currentPhase={phase} className="mb-8" />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Left Column: Domain Selection + Conversation */}
            <div className="space-y-6">
              {/* Domain Selector */}
              <div className="glass-card rounded-2xl p-5">
                <DomainSelector
                  selectedDomain={selectedDomain}
                  onSelect={handleDomainSelect}
                  disabled={phase !== "context" || messages.length > 0}
                />
              </div>

              {/* Conversation Area */}
              {selectedDomain && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-foreground">Conversation</h3>
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset
                    </Button>
                  </div>

                  {/* Messages */}
                  <div
                    ref={conversationRef}
                    className="h-[300px] overflow-y-auto mb-4 pr-2 space-y-4"
                  >
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Sparkles className="w-8 h-8 text-muted-foreground/30 mb-3" />
                        <p className="text-sm text-muted-foreground">
                          Tap the microphone or click "Advance Demo" to start
                        </p>
                      </div>
                    ) : (
                      <ArchitectConversation messages={messages} />
                    )}
                  </div>

                  {/* Voice Orb + Demo Control */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <ArchitectVoiceOrb
                      isListening={isListening}
                      isProcessing={isProcessing}
                      onToggle={handleVoiceToggle}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={advanceDemo}
                      disabled={
                        isListening ||
                        isProcessing ||
                        demoStep >= (mockConversationsByDomain[selectedDomain.id]?.length || 0)
                      }
                    >
                      Advance Demo
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column: Questions */}
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Question Sequence</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {questions.length > 0
                        ? `${questions.length} questions • Drag to reorder`
                        : "Questions will appear as the conversation progresses"}
                    </p>
                  </div>
                  {questions.length > 0 && (
                    <PrimaryButton size="sm" onClick={handleFinalize}>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Finalize
                    </PrimaryButton>
                  )}
                </div>

                {/* Questions List */}
                <div className="min-h-[400px]">
                  {questions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center">
                      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Select an interview type and progress through<br />the conversation to generate questions
                      </p>
                    </div>
                  ) : (
                    <Reorder.Group
                      axis="y"
                      values={questions}
                      onReorder={setQuestions}
                      className="space-y-3"
                    >
                      <AnimatePresence>
                        {questions.map((question, index) => (
                          <Reorder.Item key={question.id} value={question}>
                            <StructuredQuestionCard
                              question={question}
                              index={index}
                              onEdit={handleEditQuestion}
                              onDelete={handleDeleteQuestion}
                            />
                          </Reorder.Item>
                        ))}
                      </AnimatePresence>
                    </Reorder.Group>
                  )}
                </div>
              </div>

              {/* Context Summary */}
              {selectedDomain && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-2xl p-5"
                >
                  <h4 className="text-sm font-medium text-foreground mb-3">Interview Context</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium text-foreground">{selectedDomain.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium text-foreground">{selectedDomain.duration}</span>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Constraints</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedDomain.constraints.map((c, i) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
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
        interviewType={selectedDomain?.name}
      />
    </div>
  );
};

export default InterviewArchitectTest;
