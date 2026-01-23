import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type InterviewStatus = "idle" | "connecting" | "in-conversation" | "completed";

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
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [callStatus, setCallStatus] = useState<InterviewStatus>("idle");

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
      setStep(2);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleStartCall = () => {
    setCallStatus("connecting");
    // Simulate connection delay
    setTimeout(() => {
      setCallStatus("in-conversation");
    }, 2000);
  };

  const handleEndCall = () => {
    setCallStatus("completed");
  };

  const getStatusText = () => {
    switch (callStatus) {
      case "idle":
        return "Ready to start";
      case "connecting":
        return "Connecting…";
      case "in-conversation":
        return "In conversation";
      case "completed":
        return "Interview completed";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 section-container py-8 md:py-12 pt-24 md:pt-28 flex items-center justify-center">
        <div className="w-full max-w-[550px]">
          {/* Debug token display */}
          {token && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground text-center mb-4"
            >
              Interview ID: {token}
            </motion.p>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
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
                            className={`pl-10 ${errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                          />
                        </div>
                        {errors.firstName && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                          >
                            {errors.firstName}
                          </motion.p>
                        )}
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
                            className={`pl-10 ${errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                          />
                        </div>
                        {errors.lastName && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                          >
                            {errors.lastName}
                          </motion.p>
                        )}
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
                            className={`pl-10 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                          />
                        </div>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="pt-4"
                      >
                        <Button
                          type="submit"
                          className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Start interview
                        </Button>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="call"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Card className="glass-card border-border/50 overflow-hidden">
                  <CardContent className="p-8 md:p-12">
                    <div className="flex flex-col items-center space-y-8">
                      {/* Agent Avatar/Orb */}
                      <div className="relative">
                        {/* Outer glow ring */}
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-interu-blue via-interu-purple to-interu-coral opacity-30 blur-xl"
                          animate={{
                            scale: callStatus === "in-conversation" ? [1, 1.2, 1] : 1,
                            opacity: callStatus === "connecting" ? [0.2, 0.4, 0.2] : 0.3,
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          style={{ width: "160px", height: "160px", margin: "-20px" }}
                        />

                        {/* Main orb */}
                        <motion.div
                          className="relative w-32 h-32 rounded-full bg-gradient-to-br from-interu-blue-light via-interu-purple-light to-interu-coral-light flex items-center justify-center shadow-lg"
                          animate={{
                            boxShadow:
                              callStatus === "in-conversation"
                                ? [
                                    "0 0 20px hsl(var(--interu-blue) / 0.3)",
                                    "0 0 40px hsl(var(--interu-purple) / 0.4)",
                                    "0 0 20px hsl(var(--interu-blue) / 0.3)",
                                  ]
                                : "0 0 20px hsl(var(--interu-blue) / 0.2)",
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          {/* Inner circle with pulse */}
                          <motion.div
                            className="w-20 h-20 rounded-full bg-gradient-to-br from-interu-blue to-interu-purple flex items-center justify-center"
                            animate={{
                              scale: callStatus === "connecting" ? [1, 1.1, 1] : 1,
                            }}
                            transition={{
                              duration: 1,
                              repeat: callStatus === "connecting" ? Infinity : 0,
                              ease: "easeInOut",
                            }}
                          >
                            <motion.div
                              className="w-8 h-8 rounded-full bg-background/90"
                              animate={{
                                scale:
                                  callStatus === "in-conversation" ? [1, 0.9, 1] : 1,
                              }}
                              transition={{
                                duration: 0.5,
                                repeat:
                                  callStatus === "in-conversation" ? Infinity : 0,
                                ease: "easeInOut",
                              }}
                            />
                          </motion.div>
                        </motion.div>
                      </div>

                      {/* Status Text */}
                      <motion.div
                        key={callStatus}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-2"
                      >
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                          {getStatusText()}
                        </h2>
                        {callStatus === "connecting" && (
                          <motion.div
                            className="flex justify-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full bg-primary"
                                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                              />
                            ))}
                          </motion.div>
                        )}
                        {callStatus === "completed" && (
                          <p className="text-muted-foreground">
                            Thank you for participating!
                          </p>
                        )}
                      </motion.div>

                      {/* Respondent Info */}
                      <div className="text-center text-sm text-muted-foreground">
                        <p>
                          {formData.firstName} {formData.lastName}
                        </p>
                        <p>{formData.email}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                        {callStatus === "idle" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full"
                          >
                            <Button
                              onClick={handleStartCall}
                              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <Phone className="mr-2 h-5 w-5" />
                              Start interview
                            </Button>
                          </motion.div>
                        )}

                        {callStatus === "in-conversation" && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full"
                          >
                            <Button
                              onClick={handleEndCall}
                              variant="destructive"
                              className="w-full h-12 text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <PhoneOff className="mr-2 h-5 w-5" />
                              End call
                            </Button>
                          </motion.div>
                        )}

                        {callStatus === "completed" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full"
                          >
                            <Button
                              onClick={() => window.close()}
                              variant="outline"
                              className="w-full h-12 text-base font-medium"
                            >
                              Close window
                            </Button>
                          </motion.div>
                        )}
                      </div>

                      {/* Integration Note */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xs text-muted-foreground text-center max-w-sm"
                      >
                        ElevenLabs voice agent will be integrated here later.
                      </motion.p>
                    </div>
                  </CardContent>
                </Card>
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
