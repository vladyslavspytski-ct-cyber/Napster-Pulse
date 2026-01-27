import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, CheckCircle2, RotateCcw } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PublicInterviewVoiceAgentCard from "@/components/PublicInterviewVoiceAgentCard";
import { getSignedUrl, ElevenLabsConversation } from "@/lib/elevenlabs";

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

// Interview Host Agent ID
const INTERVIEW_HOST_AGENT_ID = "agent_3901kfzdsmpjeee9n3tvfkhgnnrm";

// Hardcoded test questions (for now)
const TEST_QUESTIONS = [
  "What is your name?",
  "How old are you?",
  "Do you have a cat?",
];

const PublicInterview = () => {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("details");
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
  const assistantBufferRef = useRef<string>("");

  // Type for interview results from agent
  interface InterviewResult {
    status: "completed" | "stopped";
    answers: Array<{ question: string; answer: string }>;
  }

  // Try to parse interview results from agent messages
  const tryParseResults = (buffer: string): InterviewResult | null => {
    try {
      // Look for JSON in the buffer
      const jsonMatch = buffer.match(/\{[\s\S]*"status"[\s\S]*"answers"[\s\S]*\}/);
      if (!jsonMatch) return null;

      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.status && Array.isArray(parsed.answers)) {
        return parsed as InterviewResult;
      }
    } catch {
      // Not valid JSON yet
    }
    return null;
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
      setAgentState("connecting");

      // Clear any previous transcript
      assistantBufferRef.current = "";

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

      // Get signed URL from backend
      console.log("[PublicInterview] Fetching signed URL for agent:", INTERVIEW_HOST_AGENT_ID);
      const signedUrl = await getSignedUrl(INTERVIEW_HOST_AGENT_ID);
      console.log("[PublicInterview] Signed URL received");

      // Format questions for dynamic variables (must match agent prompt variable name exactly)
      const questionsText = TEST_QUESTIONS.map((q, i) => `${i + 1}. ${q}`).join("\n");
      console.log("[PublicInterview] QUESTIONS variable value:", questionsText);
      console.log("[PublicInterview] Will send dynamic_variables.QUESTIONS (uppercase)");

      // Create conversation instance
      const conversation = new ElevenLabsConversation({
        onStatusChange: (status) => {
          console.log("[PublicInterview] Status changed:", status);
          if (status === "connected") {
            setAgentState("listening");
            // Set the first question as current (for UI display)
            setCurrentQuestion(TEST_QUESTIONS[0]);
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
          // Accumulate all agent messages for later parsing
          assistantBufferRef.current += message + "\n";
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

      // Try to parse interview results from accumulated agent messages
      const buffer = assistantBufferRef.current;
      console.log("[PublicInterview] Full agent transcript:", buffer);

      const results = tryParseResults(buffer);
      if (results) {
        console.log("[PublicInterview] === Interview Results ===");
        console.log("[PublicInterview] Status:", results.status);
        console.log("[PublicInterview] Q&A Pairs:");
        results.answers.forEach((qa, index) => {
          console.log(`[PublicInterview]   ${index + 1}. Q: ${qa.question}`);
          console.log(`[PublicInterview]      A: ${qa.answer}`);
        });
        console.log("[PublicInterview] === End Results ===");
      } else {
        console.log("[PublicInterview] Could not parse interview results from transcript");
        console.log("[PublicInterview] Note: The agent may not have output the final JSON summary yet");
      }

      // Clear the buffer for potential future interviews
      assistantBufferRef.current = "";

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
    assistantBufferRef.current = "";
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
            {/* STEP 1: Participant Details Form */}
            {step === "details" && (
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
                          Welcome to the Interview
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
                {token && (
                  <motion.p
                    variants={itemVariants}
                    className="text-xs text-muted-foreground/50 text-center"
                  >
                    Interview: {token.slice(0, 8)}...
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* STEP 2: Interview Session */}
            {step === "interview" && (
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
            {step === "completed" && (
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
