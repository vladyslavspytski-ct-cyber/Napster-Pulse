import { motion } from "framer-motion";
import { Link2Off, AlertCircle, Home, RotateCcw, X, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Button } from "@/components/ui/button";

export type ErrorType = "not-found" | "generic";

interface PublicInterviewErrorProps {
  /** The type of error to display */
  type?: ErrorType;
  /** Interview key preview for context (optional) */
  interviewKey?: string;
  /** Callback when user clicks "Go Home" - placeholder for now */
  onGoHome?: () => void;
  /** Callback when user clicks "Retry" - only shown for generic errors */
  onRetry?: () => void;
  /** Callback when user clicks "Close Tab" */
  onCloseTab?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } 
  },
};

/**
 * Reusable error state component for PublicInterview page.
 * Supports "not-found" (interview deleted/invalid) and "generic" error types.
 */
const PublicInterviewError = ({
  type = "not-found",
  interviewKey,
  onGoHome = () => {
    // TODO: Wire up navigation to home
  },
  onRetry = () => {
    // TODO: Wire up retry logic
  },
  onCloseTab = () => {
    // TODO: Wire up close tab logic
  },
}: PublicInterviewErrorProps) => {
  const isNotFound = type === "not-found";
  
  // Truncate key for display
  const keyPreview = interviewKey 
    ? `${interviewKey.slice(0, 8)}...` 
    : "ba9a4bf6...";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-lg mx-auto"
    >
      {/* Glass Card Container */}
      <Card className="glass-card shadow-card border-border/50 overflow-hidden">
        <CardHeader className="text-center pb-2 pt-8">
          {/* Decorative Illustration */}
          <motion.div
            variants={itemVariants}
            className="mx-auto mb-6"
          >
            <div className="relative w-20 h-20 mx-auto">
              {/* Pastel gradient circle background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 via-accent/10 to-secondary opacity-60" />
              
              {isNotFound ? (
                /* Not Found Illustration: Broken microphone/link */
                <svg
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative w-full h-full"
                >
                  {/* Outer dashed circle */}
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="hsl(var(--primary))"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.3"
                  />
                  
                  {/* Microphone body */}
                  <rect
                    x="32"
                    y="20"
                    width="16"
                    height="26"
                    rx="8"
                    fill="hsl(var(--primary))"
                    opacity="0.15"
                    stroke="hsl(var(--primary))"
                    strokeWidth="1.5"
                  />
                  
                  {/* Microphone stand arc */}
                  <path
                    d="M26 40 C26 50 33 56 40 56 C47 56 54 50 54 40"
                    stroke="hsl(var(--primary))"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.4"
                  />
                  
                  {/* Microphone stand */}
                  <line
                    x1="40"
                    y1="56"
                    x2="40"
                    y2="62"
                    stroke="hsl(var(--primary))"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.4"
                  />
                  
                  {/* Stand base */}
                  <line
                    x1="34"
                    y1="62"
                    x2="46"
                    y2="62"
                    stroke="hsl(var(--primary))"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.4"
                  />
                  
                  {/* Diagonal "off" line */}
                  <line
                    x1="24"
                    y1="58"
                    x2="56"
                    y2="22"
                    stroke="hsl(var(--accent))"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                  
                  {/* Broken link indicators */}
                  <circle
                    cx="26"
                    cy="26"
                    r="3"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.5"
                  />
                  <circle
                    cx="54"
                    cy="54"
                    r="3"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.5"
                  />
                </svg>
              ) : (
                /* Generic Error Illustration: Alert circle */
                <svg
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative w-full h-full"
                >
                  {/* Outer dashed circle */}
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="hsl(var(--destructive))"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.3"
                  />
                  
                  {/* Inner circle */}
                  <circle
                    cx="40"
                    cy="40"
                    r="24"
                    fill="hsl(var(--destructive))"
                    opacity="0.1"
                    stroke="hsl(var(--destructive))"
                    strokeWidth="1.5"
                  />
                  
                  {/* Exclamation mark */}
                  <line
                    x1="40"
                    y1="30"
                    x2="40"
                    y2="44"
                    stroke="hsl(var(--destructive))"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                  <circle
                    cx="40"
                    cy="52"
                    r="2"
                    fill="hsl(var(--destructive))"
                    opacity="0.8"
                  />
                </svg>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
              {isNotFound ? "Interview not found" : "Something went wrong"}
            </CardTitle>
          </motion.div>
          <motion.div variants={itemVariants}>
            <CardDescription className="text-base text-muted-foreground mt-2">
              {isNotFound 
                ? "This interview link is invalid or the interview was deleted."
                : "We couldn't load the interview. Please try again."}
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="pt-4 pb-8 px-6 md:px-8">
          {/* Interview key chip (only for not-found) */}
          {isNotFound && (
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                <Link2Off className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-mono text-muted-foreground">
                  Interview: {keyPreview}
                </span>
              </div>
            </motion.div>
          )}

          {/* Helpful next steps (only for not-found) */}
          {isNotFound && (
            <motion.div
              variants={itemVariants}
              className="mb-8"
            >
              <h4 className="text-sm font-medium text-foreground mb-3">
                What you can try:
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Ask the creator to send a new link
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Check if you copied the full URL
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  If you believe this is a mistake, contact support
                </li>
              </ul>
            </motion.div>
          )}

          {/* Action buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3"
          >
            <PrimaryButton
              onClick={onGoHome}
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Interu Home
            </PrimaryButton>
            
            {isNotFound ? (
              <Button
                variant="outline"
                onClick={onCloseTab}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Close tab
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={onRetry}
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try again
              </Button>
            )}
          </motion.div>

          {/* Contact support link */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-4"
          >
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
            >
              <Mail className="w-3.5 h-3.5" />
              Contact support
            </a>
          </motion.div>
        </CardContent>
      </Card>

      {/* Powered by Interu */}
      <motion.p
        variants={itemVariants}
        className="text-center text-xs text-muted-foreground/60 mt-6"
      >
        Powered by Interu
      </motion.p>
    </motion.div>
  );
};

export default PublicInterviewError;
