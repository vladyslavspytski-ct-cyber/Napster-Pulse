import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SavedInterviewBlock from "@/components/SavedInterviewBlock";
import CreateInterviewVoiceAgentCard from "@/components/CreateInterviewVoiceAgentCard";
import { generateInterviewId, generateToken, saveInterview } from "@/lib/interviewStorage";
import { getSignedUrl, ElevenLabsConversation } from "@/lib/elevenlabs";

type AgentUIState = "disconnected" | "connecting" | "connected" | "disconnecting";

interface Question {
  id: string;
  text: string;
  isEditing: boolean;
}

const AGENT_ID = "agent_5501kfn6xt2vek481a42ezynaqbq";

const CreateInterview = () => {
  const { toast } = useToast();
  const [interviewName, setInterviewName] = useState("");
  const [agentState, setAgentState] = useState<AgentUIState>("disconnected");
  const [inputLevel, setInputLevel] = useState(0);
  const [outputLevel, setOutputLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [savedData, setSavedData] = useState<{
    title: string;
    questionsCount: number;
    publicUrl: string;
  } | null>(null);

  const conversationRef = useRef<ElevenLabsConversation | null>(null);
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const assistantBufferRef = useRef<string>("");
  const lastQuestionsRef = useRef<{ questions: string[] } | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const volumeInterval = volumeIntervalRef.current;
      const conversation = conversationRef.current;

      if (volumeInterval) {
        clearInterval(volumeInterval);
      }
      if (conversation) {
        conversation.endSession();
      }
    };
  }, []);

  // Start volume polling
  const startVolumePolling = () => {
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
    }

    volumeIntervalRef.current = setInterval(() => {
      if (conversationRef.current) {
        const inputVol = conversationRef.current.getInputVolume();
        const outputVol = conversationRef.current.getOutputVolume();
        setInputLevel(inputVol);
        setOutputLevel(outputVol);
      }
    }, 80);
  };

  // Stop volume polling
  const stopVolumePolling = () => {
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
    setInputLevel(0);
    setOutputLevel(0);
  };

  // Try to parse questions from assistant buffer
  const tryParseQuestions = (buffer: string): { questions: string[] } | null => {
    try {
      // Try to find JSON in the buffer
      const jsonMatch = buffer.match(/\{[\s\S]*"questions"[\s\S]*\}/);
      if (!jsonMatch) return null;

      const parsed = JSON.parse(jsonMatch[0]);

      if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return { questions: parsed.questions };
      }
    } catch (err) {
      // Invalid JSON, continue accumulating
    }
    return null;
  };

  // Handle assistant messages and accumulate
  const handleAssistantMessage = (message: string) => {
    // Accumulate the message
    assistantBufferRef.current += message;

    // Try to parse questions
    const result = tryParseQuestions(assistantBufferRef.current);
    if (result) {
      lastQuestionsRef.current = result;
    }
  };

  const handleStartRecording = async () => {
    try {
      setAgentState("connecting");
      setErrorMessage(null);

      // Request microphone permission
      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (micError) {
        if (micError instanceof Error && micError.name === "NotAllowedError") {
          setErrorMessage("Microphone access denied. Please allow microphone access to use voice dictation.");
        } else {
          setErrorMessage("Could not access microphone. Please check your device settings.");
        }
        setAgentState("disconnected");
        toast({
          title: "Microphone error",
          description: "Unable to access microphone",
          variant: "destructive",
        });
        return;
      }

      // Get signed URL from backend
      const signedUrl = await getSignedUrl(AGENT_ID);

      // Clear buffers on new session
      assistantBufferRef.current = "";
      lastQuestionsRef.current = null;

      // Create and start conversation
      const conversation = new ElevenLabsConversation({
        onStatusChange: (status) => {
          if (status === "connected") {
            setAgentState("connected");
            startVolumePolling();
            toast({
              title: "Connected",
              description: "Voice assistant is ready. Start speaking.",
            });
          } else if (status === "disconnected") {
            setAgentState("disconnected");
            stopVolumePolling();
          } else if (status === "error") {
            setErrorMessage("Connection error occurred");
            setAgentState("disconnected");
            stopVolumePolling();
          }
        },
        onError: (error) => {
          console.error("Conversation error:", error);
          setErrorMessage(error.message || "An error occurred");
          toast({
            title: "Error",
            description: error.message || "An error occurred",
            variant: "destructive",
          });
        },
        onAssistantMessage: handleAssistantMessage,
      });

      conversationRef.current = conversation;
      await conversation.startSession(signedUrl, mediaStream);

    } catch (error) {
      console.error("Error starting recording:", error);
      setAgentState("disconnected");
      setErrorMessage(error instanceof Error ? error.message : "Failed to start voice session");
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to start voice session",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = async () => {
    try {
      setAgentState("disconnecting");
      stopVolumePolling();

      if (conversationRef.current) {
        await conversationRef.current.endSession();
        conversationRef.current = null;
      }

      // Finalize: append questions from lastQuestionsRef if available
      if (lastQuestionsRef.current && lastQuestionsRef.current.questions.length > 0) {
        const newQuestions = lastQuestionsRef.current.questions.map((text, index) => ({
          id: `q-${Date.now()}-${index}`,
          text,
          isEditing: false,
        }));

        setQuestions((prev) => [...prev, ...newQuestions]);

        toast({
          title: "Session ended",
          description: `${newQuestions.length} question${newQuestions.length !== 1 ? 's' : ''} captured.`,
        });
      } else {
        toast({
          title: "Session ended",
          description: "Voice session has been stopped.",
        });
      }

      // Clear buffers
      assistantBufferRef.current = "";
      lastQuestionsRef.current = null;

      setAgentState("disconnected");
    } catch (error) {
      console.error("Error stopping recording:", error);
      setAgentState("disconnected");
      toast({
        title: "Error",
        description: "Error stopping session",
        variant: "destructive",
      });
    }
  };

  const handleAgentToggle = () => {
    if (agentState === "disconnected") {
      handleStartRecording();
    } else if (agentState === "connected") {
      handleStopRecording();
    }
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    toast({
      title: "Question deleted",
      description: "The question has been removed.",
    });
  };

  const handleEditQuestion = (id: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, isEditing: true } : q)));
  };

  const handleSaveQuestion = (id: string, newText: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, text: newText, isEditing: false } : q)));
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
                      <CardDescription>Give your interview a descriptive name (optional)</CardDescription>
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

                {/* Voice Agent Section */}
                <motion.div variants={itemVariants} id="interview-assistant" className="py-4">
                  <CreateInterviewVoiceAgentCard
                    agentName="Interview Assistant"
                    agentDescription="Tap to start voice dictation. Your questions will appear below."
                    state={agentState}
                    errorMessage={errorMessage}
                    inputLevel={inputLevel}
                    outputLevel={outputLevel}
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
