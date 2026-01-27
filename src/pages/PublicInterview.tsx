import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, CheckCircle2, RotateCcw } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PublicInterviewVoiceAgentCard from "@/components/PublicInterviewVoiceAgentCard";

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
  const { token } = useParams<{ token: string }>();
  const [step, setStep] = useState<Step>("details");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [agentState, setAgentState] = useState<AgentState>("idle");

  // Mock question for demo
  const mockQuestion = "Tell us about your experience with our product.";

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

  const handleStartInterview = () => {
    setAgentState("connecting");
    // Simulate connection
    setTimeout(() => {
      setAgentState("connected");
      // Simulate listening state
      setTimeout(() => {
        setAgentState("listening");
      }, 1000);
    }, 2000);
  };

  const handleEndInterview = () => {
    setAgentState("processing");
    // Simulate processing
    setTimeout(() => {
      setAgentState("completed");
      // Transition to completed step
      setTimeout(() => {
        setStep("completed");
      }, 1500);
    }, 1500);
  };

  const handleStartOver = () => {
    setStep("details");
    setFormData({ firstName: "", lastName: "", email: "" });
    setErrors({});
    setAgentState("idle");
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
                    currentQuestion={agentState !== "idle" ? mockQuestion : undefined}
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
