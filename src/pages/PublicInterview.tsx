import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, CheckCircle2, RotateCcw, Loader2 } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { usePublicInterview } from "@/hooks/api/usePublicInterview";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PublicInterviewVoiceAgentCard from "@/components/PublicInterviewVoiceAgentCard";
import { ElevenLabsConversation } from "@/lib/elevenlabs";

type Step = "details" | "interview" | "completed";
type AgentState = "idle" | "connecting" | "connected" | "listening" | "processing" | "completed";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const PublicInterview = () => {
  const { token: key } = useParams<{ token: string }>();

  const { toast } = useToast();
  const {
    interviewData,
    isLoading: isLoadingInterview,
    error: interviewError,
    fetchInterviewByKey,
    fetchSignedUrlByKey,
  } = usePublicInterview();

  const [step, setStep] = useState<Step>("details");
  const [isInitializing, setIsInitializing] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [currentQuestion, setCurrentQuestion] = useState<string | undefined>(undefined);

  // Refs for ElevenLabs session
  const conversationRef = useRef<ElevenLabsConversation | null>(null);
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Transcript to track conversation messages in order
  type TranscriptEntry = { role: "agent" | "user"; text: string };
  const transcriptRef = useRef<TranscriptEntry[]>([]);

  // Parse Q&A from transcript by matching questions to subsequent user answers
  const parseQAFromTranscript = (
    transcript: TranscriptEntry[],
    questions: string[]
  ): Array<{ question: string; answer: string }> => {
    const results: Array<{ question: string; answer: string }> = [];

    // For each question, find when agent asked it and capture user's answer
    for (const question of questions) {
      // Find index where agent mentions this question (fuzzy match)
      const questionLower = question.toLowerCase();
      let questionIndex = -1;

      for (let i = 0; i < transcript.length; i++) {
        if (transcript[i].role === "agent") {
          const agentText = transcript[i].text.toLowerCase();
          // Check if agent message contains key words from the question
          const questionWords = questionLower.split(" ").filter((w) => w.length > 3);
          const matchCount = questionWords.filter((w) => agentText.includes(w)).length;
          if (matchCount >= Math.min(2, questionWords.length)) {
            questionIndex = i;
            break;
          }
        }
      }

      // Find next user response after this question
      if (questionIndex >= 0) {
        for (let j = questionIndex + 1; j < transcript.length; j++) {
          if (transcript[j].role === "user") {
            results.push({
              question,
              answer: transcript[j].text,
            });
            break;
          }
        }
      } else {
        // Question wasn't found in transcript, add with empty answer
        results.push({ question, answer: "" });
      }
    }

    return results;
  };

  // Cleanup on unmount
  useEffect(() => {
    const conversationInstance = conversationRef;
    const volumeIntervalInstance = volumeIntervalRef;

    return () => {
      if (volumeIntervalInstance.current) {
        clearInterval(volumeIntervalInstance.current);
      }
      if (conversationInstance.current) {
        conversationInstance.current.endSession();
      }
    };
  }, []);

  // Initialize: fetch interview data by key
  useEffect(() => {
    const initializeInterview = async () => {
      if (!key) {
        console.error("[PublicInterview] No key provided in URL");
        setIsInitializing(false);
        return;
      }

      console.log("[PublicInterview] Initializing with key:", key);

      try {
        // Fetch interview data by key
        console.log("[PublicInterview] Fetching interview by key:", key);
        const data = await fetchInterviewByKey(key);

        if (data) {
          console.log("[PublicInterview] Interview loaded successfully:", {
            title: data.title,
            questions: data.questions,
          });
        } else {
          console.error("[PublicInterview] Failed to load interview data");
          toast({
            title: "Error",
            description: "Could not load interview. Please check the link.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("[PublicInterview] Initialization error:", err);
        toast({
          title: "Error",
          description: "Failed to initialize interview",
          variant: "destructive",
        });
      } finally {
        setIsInitializing(false);
      }
    };

    initializeInterview();
  }, [key, fetchInterviewByKey, toast]);

  // Get questions from interview data (already an array of strings)
  const questions = interviewData?.questions || [];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep("interview");
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleStartInterview = async () => {
    try {
      console.log("[PublicInterview] Starting interview...");

      // Get interviewId from backend response
      const interviewId = interviewData?.id;

      // Validate we have required data
      if (!key || !interviewId) {
        toast({
          title: "Error",
          description: "Missing interview key or ID",
          variant: "destructive",
        });
        return;
      }

      if (questions.length === 0) {
        toast({
          title: "Error",
          description: "No questions available for this interview",
          variant: "destructive",
        });
        return;
      }

      setAgentState("connecting");

      // Clear any previous transcript
      transcriptRef.current = [];

      // Request microphone permission
      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("[PublicInterview] Microphone access granted");
      } catch (micError) {
        console.error("[PublicInterview] Microphone error:", micError);
        if (micError instanceof Error && micError.name === "NotAllowedError") {
          toast({
            title: "Microphone access denied",
            description: "Please allow microphone access to start the interview.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Microphone error",
            description: "Could not access microphone. Please check your device settings.",
            variant: "destructive",
          });
        }
        setAgentState("idle");
        return;
      }

      // Get signed URL from backend using key and interviewId
      console.log("[PublicInterview] Fetching signed URL for key:", key, "interviewId:", interviewId);
      const signedUrl = await fetchSignedUrlByKey(key, interviewId);
      console.log("[PublicInterview] Signed URL received");

      // Format questions for dynamic variables (must match agent prompt variable name exactly)
      const questionsText = questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
      console.log("[PublicInterview] QUESTIONS variable value:", questionsText);
      console.log("[PublicInterview] Will send dynamic_variables.QUESTIONS (uppercase)");

      // Create conversation instance
      const conversation = new ElevenLabsConversation({
        onStatusChange: (status) => {
          console.log("[PublicInterview] Status changed:", status);
          if (status === "connected") {
            setAgentState("listening");
            // Set the first question as current (for UI display)
            setCurrentQuestion(questions[0]);
            toast({
              title: "Connected",
              description: "Interview started. Please answer the questions.",
            });
          } else if (status === "disconnected") {
            console.log("[PublicInterview] Disconnected");
          } else if (status === "error") {
            setAgentState("idle");
            toast({
              title: "Connection error",
              description: "Failed to connect to the interview agent.",
              variant: "destructive",
            });
          }
        },
        onError: (error) => {
          console.error("[PublicInterview] Conversation error:", error);
          toast({
            title: "Error",
            description: error.message || "An error occurred",
            variant: "destructive",
          });
        },
        onAssistantMessage: (message) => {
          console.log("[PublicInterview] Agent message:", message);
          transcriptRef.current.push({ role: "agent", text: message });
        },
        onUserMessage: (message) => {
          console.log("[PublicInterview] User message:", message);
          transcriptRef.current.push({ role: "user", text: message });
        },
      });

      conversationRef.current = conversation;

      // Start session with dynamic variables for questions
      // Note: Variable name must match exactly what the agent prompt expects (QUESTIONS)
      await conversation.startSession(signedUrl, mediaStream, {
        dynamicVariables: {
          QUESTIONS: questionsText,
        },
      });

      console.log("[PublicInterview] Session started successfully");

    } catch (error) {
      console.error("[PublicInterview] Error starting interview:", error);
      setAgentState("idle");
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to start interview",
        variant: "destructive",
      });
    }
  };

  const handleEndInterview = async () => {
    try {
      console.log("[PublicInterview] Ending interview...");
      setAgentState("processing");

      // End the session
      if (conversationRef.current) {
        await conversationRef.current.endSession();
        conversationRef.current = null;
      }

      // Clear volume polling
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
        volumeIntervalRef.current = null;
      }

      console.log("[PublicInterview] Session ended, transitioning to completed");

      // Log full transcript
      console.log("[PublicInterview] Full transcript:", transcriptRef.current);

      // Parse Q&A from transcript
      const qaResults = parseQAFromTranscript(transcriptRef.current, questions);

      console.log("[PublicInterview] === Interview Results ===");
      qaResults.forEach((qa, index) => {
        console.log(`[PublicInterview]   ${index + 1}. Q: ${qa.question}`);
        console.log(`[PublicInterview]      A: ${qa.answer || "(no answer)"}`);
      });
      console.log("[PublicInterview] === End Results ===");

      // Clear transcript for potential future interviews
      transcriptRef.current = [];

      setAgentState("completed");
      setCurrentQuestion(undefined);

      // Transition to completed step after a brief delay
      setTimeout(() => {
        setStep("completed");
      }, 1500);

    } catch (error) {
      console.error("[PublicInterview] Error ending interview:", error);
      setAgentState("idle");
      toast({
        title: "Error",
        description: "Error ending interview session",
        variant: "destructive",
      });
    }
  };

  const handleStartOver = () => {
    setStep("details");
    setFormData({ firstName: "", lastName: "", email: "" });
    setErrors({});
    setAgentState("idle");
    setCurrentQuestion(undefined);
    transcriptRef.current = [];
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 section-container py-8 md:py-12 pt-24 md:pt-28">
        <div className="mx-auto w-full lg:w-[650px]">
          <AnimatePresence mode="wait">
            {/* Loading State */}
            {isInitializing && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading interview...</p>
              </motion.div>
            )}

            {/* Error State */}
            {!isInitializing && interviewError && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="glass-card border-destructive/50">
                  <CardContent className="p-8 text-center">
                    <p className="text-destructive font-medium mb-2">Failed to load interview</p>
                    <p className="text-muted-foreground text-sm">
                      Please check the link and try again.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* STEP 1: Participant Details Form */}
            {!isInitializing && !interviewError && step === "details" && (
              <motion.div
                key="details"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <Card className="glass-card border-border/50">
                    <CardHeader className="text-center pb-2">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <CardTitle className="text-2xl md:text-3xl font-bold">
                          {interviewData?.title || "Welcome to the Interview"}
                        </CardTitle>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <CardDescription className="text-base">
                          Please enter your details to begin
                        </CardDescription>
                      </motion.div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="firstName" className="text-sm font-medium">
                            First name <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="firstName"
                              placeholder="John"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                              className={`pl-10 bg-background/50 ${errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            />
                          </div>
                          <AnimatePresence>
                            {errors.firstName && (
                              <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-sm text-destructive"
                              >
                                {errors.firstName}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="lastName" className="text-sm font-medium">
                            Last name <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="lastName"
                              placeholder="Doe"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange("lastName", e.target.value)}
                              className={`pl-10 bg-background/50 ${errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            />
                          </div>
                          <AnimatePresence>
                            {errors.lastName && (
                              <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-sm text-destructive"
                              >
                                {errors.lastName}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="email" className="text-sm font-medium">
                            Email <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              className={`pl-10 bg-background/50 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            />
                          </div>
                          <AnimatePresence>
                            {errors.email && (
                              <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-sm text-destructive"
                              >
                                {errors.email}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="pt-4"
                        >
                          <PrimaryButton
                            type="submit"
                            className="w-full h-12 text-base font-medium"
                          >
                            Start interview
                          </PrimaryButton>
                        </motion.div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Interview ID (subtle) */}
                {key && (
                  <motion.p
                    variants={itemVariants}
                    className="text-xs text-muted-foreground/50 text-center"
                  >
                    Interview: {key.slice(0, 8)}...
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* STEP 2: Interview Session */}
            {!isInitializing && !interviewError && step === "interview" && (
              <motion.div
                id="public-interview-step-agent"
                key="interview"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* Voice Agent Card */}
                <motion.div variants={itemVariants}>
                  <PublicInterviewVoiceAgentCard
                    participantName={formData.firstName}
                    currentQuestion={currentQuestion}
                    state={agentState}
                    onStart={handleStartInterview}
                    onEnd={handleEndInterview}
                  />
                </motion.div>

                {/* Participant Info Card */}
                <motion.div variants={itemVariants}>
                  <Card className="glass-card border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <p className="text-muted-foreground">Participant</p>
                          <p className="font-medium text-foreground">
                            {formData.firstName} {formData.lastName}
                          </p>
                        </div>
                        <div className="text-sm text-right">
                          <p className="text-muted-foreground">Email</p>
                          <p className="font-medium text-foreground">{formData.email}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Instructions */}
                {agentState === "idle" && (
                  <motion.div variants={itemVariants}>
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-4">
                        <p className="text-sm text-center text-muted-foreground">
                          Tap the phone button above to begin the interview. Speak clearly and take your time with each answer.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* STEP 3: Completion Screen */}
            {!isInitializing && !interviewError && step === "completed" && (
              <motion.div
                key="completed"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <Card className="glass-card border-border/50">
                    <CardContent className="p-8 md:p-12 flex flex-col items-center text-center">
                      {/* Success Icon */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
                      >
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                      </motion.div>

                      {/* Thank You Message */}
                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl md:text-3xl font-bold text-foreground mb-2"
                      >
                        Thank you, {formData.firstName}!
                      </motion.h2>
                      
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground mb-8 max-w-sm"
                      >
                        Your interview has been completed successfully. Your responses have been recorded and will be reviewed shortly.
                      </motion.p>

                      {/* Actions */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-3 w-full max-w-xs"
                      >
                        <PrimaryButton
                          onClick={() => window.close()}
                          className="flex-1 h-12"
                        >
                          Done
                        </PrimaryButton>
                        <SecondaryButton
                          onClick={handleStartOver}
                          className="flex-1 h-12"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Start over
                        </SecondaryButton>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Subtle footer text */}
                <motion.p
                  variants={itemVariants}
                  className="text-xs text-muted-foreground/50 text-center"
                >
                  Powered by Interu
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PublicInterview;
