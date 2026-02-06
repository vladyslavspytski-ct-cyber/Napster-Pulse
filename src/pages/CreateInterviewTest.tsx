import { useState, useEffect, useRef } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Plus, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhaseIndicator, { Phase } from "@/components/create-interview-test/PhaseIndicator";
import ConversationMessage, { Message } from "@/components/create-interview-test/ConversationMessage";
import QuestionCard, { Question } from "@/components/create-interview-test/QuestionCard";
import VoiceIndicator from "@/components/create-interview-test/VoiceIndicator";
import FinalizedQuestionsModal from "@/components/create-interview-test/FinalizedQuestionsModal";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Input } from "@/components/ui/input";

// Mock conversation script
const mockConversationScript: Omit<Message, "timestamp">[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi! I'm your interview design assistant. Let's create a great interview together. What's the main purpose of this interview?",
  },
  {
    id: "2",
    role: "user",
    content: "I'm hiring for a senior product manager role.",
  },
  {
    id: "3",
    role: "assistant",
    content: "Great! A PM interview. What specific skills or traits are most important for this role?",
  },
  {
    id: "4",
    role: "user",
    content: "Strategic thinking, stakeholder management, and data-driven decision making.",
  },
  {
    id: "5",
    role: "assistant",
    content: "Perfect. I've drafted some initial questions based on those focus areas. You can see them appearing on the right. Should we add questions about leadership experience too?",
  },
  {
    id: "6",
    role: "user",
    content: "Yes, definitely add leadership questions.",
  },
  {
    id: "7",
    role: "assistant",
    content: "Done! I've added two leadership-focused questions. Feel free to reorder, edit, or delete any questions. When you're happy with the list, click 'Finalize Questions'.",
  },
];

// Mock questions that appear progressively
const mockQuestionSets: { afterMessageId: string; questions: Question[] }[] = [
  {
    afterMessageId: "4",
    questions: [
      { id: "q1", text: "Describe a product strategy you developed from scratch. What was your approach?", category: "Strategic Thinking" },
      { id: "q2", text: "How do you prioritize features when stakeholders have conflicting interests?", category: "Stakeholder Management" },
      { id: "q3", text: "Walk me through a decision you made using data that went against your initial intuition.", category: "Data-Driven" },
    ],
  },
  {
    afterMessageId: "6",
    questions: [
      { id: "q4", text: "Tell me about a time you had to lead a team through a difficult product pivot.", category: "Leadership" },
      { id: "q5", text: "How do you develop and mentor junior product managers?", category: "Leadership" },
    ],
  },
];

const CreateInterviewTest = () => {
  const [phase, setPhase] = useState<Phase>("discover");
  const [messages, setMessages] = useState<Message[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate conversation progression
  const advanceConversation = () => {
    if (currentMessageIndex < mockConversationScript.length) {
      const nextMessage = mockConversationScript[currentMessageIndex];
      const newMessage: Message = {
        ...nextMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setCurrentMessageIndex((prev) => prev + 1);

      // Check if we should add questions after this message
      const questionSet = mockQuestionSets.find(
        (qs) => qs.afterMessageId === nextMessage.id
      );
      if (questionSet) {
        setTimeout(() => {
          setQuestions((prev) => [...prev, ...questionSet.questions]);
          // Update phase based on progress
          if (phase === "discover") setPhase("draft");
        }, 500);
      }

      // Update phase based on conversation progress
      if (currentMessageIndex >= 4 && phase === "draft") {
        setPhase("refine");
      }
    }
  };

  // Toggle listening and auto-advance for demo
  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice input after 1.5s
      setTimeout(() => {
        setIsListening(false);
        advanceConversation();
      }, 1500);
    }
  };

  // Handle manual text input
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      advanceConversation();
      setManualInput("");
    }
  };

  // Start demo automatically
  useEffect(() => {
    // Add first assistant message after mount
    const timer = setTimeout(() => {
      advanceConversation();
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setShowFinalModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="section-container">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-interu-purple-light border border-interu-purple/20 mb-4">
              <Sparkles className="w-4 h-4 text-interu-purple" />
              <span className="text-sm font-medium text-interu-purple">AI Assistant</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Question Builder Studio
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Have a conversation with our AI to craft the perfect interview questions
            </p>
          </motion.div>

          {/* Phase Indicator */}
          <PhaseIndicator currentPhase={phase} className="mb-10" />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Conversation Area */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6 flex flex-col h-[600px]"
            >
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">Conversation</h2>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                {messages.map((message, index) => (
                  <ConversationMessage
                    key={message.id}
                    message={message}
                    index={index}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Voice/Text Input Area */}
              <div className="pt-4 border-t border-border">
                <VoiceIndicator
                  isListening={isListening}
                  onToggle={handleVoiceToggle}
                  className="mb-4"
                />

                <form onSubmit={handleManualSubmit} className="flex gap-2">
                  <Input
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Or type your response..."
                    className="flex-1"
                  />
                  <Button type="submit" variant="outline" size="sm">
                    Send
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Right: Question Cards Area */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6 flex flex-col h-[600px]"
            >
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">
                      {questions.length}
                    </span>
                  </div>
                  <h2 className="font-semibold text-foreground">Draft Questions</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setQuestions((prev) => [
                      ...prev,
                      { id: `q-new-${Date.now()}`, text: "New question..." },
                    ])
                  }
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>

              {/* Questions List with Drag & Drop */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {questions.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <p className="text-sm">Questions will appear here</p>
                      <p className="text-xs mt-1">as you chat with the assistant</p>
                    </div>
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
                        <Reorder.Item
                          key={question.id}
                          value={question}
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <QuestionCard
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

              {/* Finalize Button */}
              {questions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4 border-t border-border"
                >
                  <PrimaryButton
                    onClick={handleFinalize}
                    className="w-full"
                    size="lg"
                  >
                    Finalize Questions
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </PrimaryButton>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Demo Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 rounded-xl bg-muted/50 border border-border text-center"
          >
            <p className="text-sm text-muted-foreground mb-3">
              <strong>Demo Controls:</strong> Click the mic or send a message to advance the conversation
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMessages([]);
                  setQuestions([]);
                  setCurrentMessageIndex(0);
                  setPhase("discover");
                  setTimeout(advanceConversation, 500);
                }}
              >
                Reset Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Fast-forward: add all messages and questions
                  const allMessages = mockConversationScript.map((m) => ({
                    ...m,
                    timestamp: new Date(),
                  }));
                  setMessages(allMessages);
                  const allQuestions = mockQuestionSets.flatMap((qs) => qs.questions);
                  setQuestions(allQuestions);
                  setCurrentMessageIndex(mockConversationScript.length);
                  setPhase("refine");
                }}
              >
                Skip to End
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />

      {/* Finalized Questions Modal */}
      <FinalizedQuestionsModal
        isOpen={showFinalModal}
        onClose={() => setShowFinalModal(false)}
        questions={questions}
      />
    </div>
  );
};

export default CreateInterviewTest;
