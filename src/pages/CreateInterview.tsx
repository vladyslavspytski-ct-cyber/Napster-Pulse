import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Trash2, Pencil } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SavedInterviewBlock from "@/components/SavedInterviewBlock";
import { generateInterviewId, generateToken, saveInterview } from "@/lib/interviewStorage";

interface Question {
  id: string;
  text: string;
  isEditing: boolean;
}

const CreateInterview = () => {
  const { toast } = useToast();
  const [interviewName, setInterviewName] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [savedData, setSavedData] = useState<{
    title: string;
    questionsCount: number;
    publicUrl: string;
  } | null>(null);

  // Placeholder questions to simulate voice recognition
  const placeholderQuestions = [
    "What inspired you to pursue this career path?",
    "Can you describe a challenging project you've worked on?",
    "How do you handle feedback and criticism?",
    "What are your goals for the next five years?",
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording started",
      description: "Speak clearly to dictate your questions.",
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Simulate adding placeholder questions (will be replaced with ElevenLabs SDK)
    const newQuestions = placeholderQuestions.map((text, index) => ({
      id: `q-${Date.now()}-${index}`,
      text,
      isEditing: false,
    }));
    setQuestions((prev) => [...prev, ...newQuestions]);
    toast({
      title: "Recording stopped",
      description: `${placeholderQuestions.length} questions recognized.`,
    });
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    toast({
      title: "Question deleted",
      description: "The question has been removed.",
    });
  };

  const handleEditQuestion = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isEditing: true } : q))
    );
  };

  const handleSaveQuestion = (id: string, newText: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, text: newText, isEditing: false } : q))
    );
  };

  const handleSaveAndGenerateLink = () => {
    const id = generateInterviewId();
    const token = generateToken();
    const origin = window.location.origin;
    const publicUrl = `${origin}/i/${token}`;

    // Save to localStorage
    saveInterview({
      id,
      title: interviewName || "Untitled Interview",
      questions: questions.map((q) => ({ id: q.id, text: q.text })),
      token,
      publicUrl,
      createdAt: new Date().toISOString(),
    });

    setSavedData({
      title: interviewName || "Untitled Interview",
      questionsCount: questions.length,
      publicUrl,
    });
    setIsSaved(true);

    toast({
      title: "Interview saved!",
      description: "Your interview link is ready to share.",
    });
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
        <div className="max-w-2xl mx-auto">
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
                <motion.div variants={itemVariants}>
                  <Card className="glass-card border-border/50">
                    <CardHeader>
                      <CardTitle className="text-xl">Interview Name</CardTitle>
                      <CardDescription>
                        Give your interview a descriptive name (optional)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Input
                        placeholder="e.g., Product Manager Interview Q1 2024"
                        value={interviewName}
                        onChange={(e) => setInterviewName(e.target.value)}
                        className="bg-background/50"
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Voice Input Section */}
                <motion.div variants={itemVariants}>
                  <Card className="glass-card border-border/50">
                    <CardHeader>
                      <CardTitle className="text-xl">Voice Input</CardTitle>
                      <CardDescription>
                        Dictate your interview questions using voice
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <PrimaryButton
                          size="lg"
                          onClick={handleStartRecording}
                          disabled={isRecording}
                          className={`gap-2 ${isRecording ? "opacity-50" : ""}`}
                        >
                          <Mic className="h-5 w-5" />
                          Start Recording
                        </PrimaryButton>
                        <SecondaryButton
                          size="lg"
                          onClick={handleStopRecording}
                          disabled={!isRecording}
                          className={`gap-2 ${
                            !isRecording ? "opacity-50" : "border-destructive text-destructive"
                          }`}
                        >
                          <MicOff className="h-5 w-5" />
                          Stop Recording
                        </SecondaryButton>
                      </div>
                      {isRecording && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-center gap-2 text-primary"
                        >
                          <div className="w-3 h-3 bg-destructive rounded-full animate-ping" />
                          <span className="text-sm font-medium">Recording in progress...</span>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Questions List Section */}
                <AnimatePresence>
                  {questions.length > 0 && (
                    <motion.div
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
                <motion.div variants={itemVariants}>
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
                        disabled={questions.length === 0}
                        className="w-full"
                        size="lg"
                      >
                        Save interview & Generate link
                      </PrimaryButton>
                      {questions.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center">
                          Add at least one question to save your interview.
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

export default CreateInterview;
