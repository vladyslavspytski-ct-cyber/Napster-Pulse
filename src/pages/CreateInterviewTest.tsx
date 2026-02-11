import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SavedInterviewBlock from "@/components/SavedInterviewBlock";
import CreateInterviewVoiceAgentCard from "@/components/CreateInterviewVoiceAgentCard";

type AgentUIState = "disconnected" | "connecting" | "connected" | "disconnecting";

interface Question {
  id: string;
  text: string;
  isEditing: boolean;
}

/**
 * UI-only test version of CreateInterview.
 * No backend calls, no voice logic — purely static placeholders.
 */
const CreateInterviewTest = () => {
  const [interviewName, setInterviewName] = useState("");
  const [agentState, setAgentState] = useState<AgentUIState>("disconnected");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [savedData, setSavedData] = useState<{
    title: string;
    questionsCount: number;
    publicUrl: string;
  } | null>(null);

  // Simulated toggle — cycles through states visually only
  const handleAgentToggle = () => {
    if (agentState === "disconnected") {
      setAgentState("connecting");
      setTimeout(() => setAgentState("connected"), 400);
    } else if (agentState === "connected") {
      setAgentState("disconnecting");
      setTimeout(() => setAgentState("disconnected"), 300);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleEditQuestion = (id: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, isEditing: true } : q)));
  };

  const handleSaveQuestion = (id: string, newText: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, text: newText, isEditing: false } : q)));
  };

  const handleSaveAndGenerateLink = () => {
    const trimmedName = interviewName.trim();
    if (!trimmedName || questions.length === 0) return;

    setSavedData({
      title: trimmedName,
      questionsCount: questions.length,
      publicUrl: `${window.location.origin}/i/test-placeholder`,
    });
    setIsSaved(true);
  };

  const handleCreateAnother = () => {
    setInterviewName("");
    setQuestions([]);
    setIsSaved(false);
    setSavedData(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  };

  const questionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 section-container py-8 md:py-12 pt-24 md:pt-28">
        <div className="mx-auto w-full lg:w-[650px]">
          <AnimatePresence mode="wait">
            {!isSaved ? (
              <motion.div
                key="editor"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                {/* Interview Name Section */}
                <motion.div variants={itemVariants} id="interview-name">
                  <Card className="glass-card border-border/50">
                    <CardHeader>
                      <CardTitle className="text-xl">Interview Name</CardTitle>
                      <CardDescription>Give your interview a descriptive name</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Input
                        placeholder="e.g., Product Manager Interview — Q1 2026"
                        value={interviewName}
                        onChange={(e) => setInterviewName(e.target.value)}
                        className="bg-background/50"
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Voice Agent Section (UI-only, no real connection) */}
                <motion.div variants={itemVariants} id="interview-assistant" className="py-4">
                  <CreateInterviewVoiceAgentCard
                    agentName="Interview Assistant"
                    agentDescription="Tap to start voice dictation. Your questions will appear below."
                    state={agentState}
                    errorMessage={null}
                    inputLevel={0}
                    outputLevel={0}
                    onToggle={handleAgentToggle}
                  />
                </motion.div>

                {/* Questions List Section */}
                <AnimatePresence>
                  {questions.length > 0 && (
                    <motion.div
                      id="interview-questions"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Card className="glass-card border-border/50">
                        <CardHeader>
                          <CardTitle className="text-xl">Interview Questions</CardTitle>
                          <CardDescription>
                            {questions.length} question{questions.length !== 1 ? "s" : ""} added
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            <AnimatePresence>
                              {questions.map((question, index) => (
                                <motion.li
                                  key={question.id}
                                  variants={questionVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  layout
                                  className="flex items-start gap-3 p-4 rounded-xl bg-background/50 border border-border/30 transition-all duration-200 hover:shadow-card"
                                >
                                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                                    {index + 1}
                                  </span>
                                  {question.isEditing ? (
                                    <Input
                                      defaultValue={question.text}
                                      className="flex-1 bg-background"
                                      autoFocus
                                      onBlur={(e) => handleSaveQuestion(question.id, e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          handleSaveQuestion(question.id, e.currentTarget.value);
                                        }
                                      }}
                                    />
                                  ) : (
                                    <p className="flex-1 text-foreground/90">{question.text}</p>
                                  )}
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-muted-foreground hover:text-primary transition-transform duration-150 active:scale-95"
                                      onClick={() => handleEditQuestion(question.id)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-muted-foreground hover:text-destructive transition-transform duration-150 active:scale-95"
                                      onClick={() => handleDeleteQuestion(question.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </motion.li>
                              ))}
                            </AnimatePresence>
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Save & Generate Link Section */}
                <motion.div variants={itemVariants} id="save-share">
                  <Card className="glass-card border-border/50">
                    <CardHeader>
                      <CardTitle className="text-xl">Save & Share</CardTitle>
                      <CardDescription>
                        Save your interview and generate a shareable link for participants
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <PrimaryButton
                        onClick={handleSaveAndGenerateLink}
                        disabled={!interviewName.trim() || questions.length === 0}
                        className="w-full"
                        size="lg"
                      >
                        Save interview & Generate link
                      </PrimaryButton>
                      {(!interviewName.trim() || questions.length === 0) && (
                        <p className="text-sm text-muted-foreground text-center">
                          {!interviewName.trim() && questions.length === 0
                            ? "Enter an interview name and add at least one question to save."
                            : !interviewName.trim()
                            ? "Enter an interview name to save your interview."
                            : "Add at least one question to save your interview."}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="saved"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6"
              >
                {savedData && (
                  <SavedInterviewBlock
                    title={savedData.title}
                    questionsCount={savedData.questionsCount}
                    publicUrl={savedData.publicUrl}
                    onCreateAnother={handleCreateAnother}
                  />
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="flex justify-center"
                >
                  <SecondaryButton size="lg" onClick={handleCreateAnother}>
                    Create Another Interview
                  </SecondaryButton>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateInterviewTest;
