import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AgentUIState = "idle" | "connecting" | "connected" | "listening" | "processing" | "completed";

interface PublicInterviewVoiceAgentCardProps {
  participantName: string;
  currentQuestion?: string;
  state: AgentUIState;
  onStart: () => void;
  onEnd: () => void;
}

const statusConfig: Record<AgentUIState, { label: string; dotClass: string }> = {
  idle: { label: "Ready to start", dotClass: "bg-muted-foreground" },
  connecting: { label: "Connecting...", dotClass: "bg-yellow-500 animate-pulse" },
  connected: { label: "Connected", dotClass: "bg-green-500" },
  listening: { label: "Listening...", dotClass: "bg-green-500 animate-pulse" },
  processing: { label: "Processing...", dotClass: "bg-yellow-500 animate-pulse" },
  completed: { label: "Completed", dotClass: "bg-primary" },
};

const PulseRings = ({ active }: { active: boolean }) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {active && (
        <motion.div
          key="pulse-rings"
          className="absolute inset-0"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.08, ease: "easeOut" },
          }}
        >
          <motion.div
            key="pulse-ring-1"
            className="absolute inset-0 rounded-full border-2 border-interu-purple/30"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 1.8], opacity: [0, 0.6, 0] }}
            exit={{
              opacity: 0,
              transition: { duration: 0.08, ease: "easeOut" },
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeOut",
              times: [0, 0.15, 1],
            }}
          />
          <motion.div
            key="pulse-ring-2"
            className="absolute inset-0 rounded-full border-2 border-interu-blue/30"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 2], opacity: [0, 0.4, 0] }}
            exit={{
              opacity: 0,
              transition: { duration: 0.08, ease: "easeOut" },
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeOut",
              delay: 0.5,
              times: [0, 0.15, 1],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PublicInterviewVoiceAgentCard = ({
  participantName,
  currentQuestion,
  state,
  onStart,
  onEnd,
}: PublicInterviewVoiceAgentCardProps) => {
  const isActive = state === "connected" || state === "listening";
  const isLoading = state === "connecting" || state === "processing";
  const isCompleted = state === "completed";

  return (
    <Card className="w-full max-w-[650px] mx-auto glass-card border-border/50">
      <CardContent className="p-8 flex flex-col items-center justify-between min-h-[420px]">
        {/* Orb Visualization */}
        <div className="relative w-32 h-32 flex items-center justify-center overflow-visible m-[22px]">
          {/* Outer glow layer */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, hsl(var(--interu-purple-light)) 0%, transparent 70%)`,
              filter: isActive ? "blur(80px)" : "blur(60px)",
            }}
            animate={
              isActive
                ? { scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }
                : { scale: 1, opacity: 0.2 }
            }
            transition={{
              duration: 2,
              repeat: isActive ? Infinity : 0,
              ease: "easeInOut",
            }}
          />
          
          {/* Middle gradient layer */}
          <motion.div
            className="absolute inset-2 rounded-full"
            style={{
              background: `linear-gradient(135deg, hsl(var(--interu-blue-light)) 0%, hsl(var(--interu-purple-light)) 50%, hsl(var(--interu-coral-light)) 100%)`,
              filter: "blur(8px)",
            }}
            animate={
              isActive
                ? { scale: 1.05, rotate: 360 }
                : { scale: 1, rotate: 0 }
            }
            transition={
              isActive
                ? { scale: { duration: 0.3, ease: "easeOut" }, rotate: { duration: 20, repeat: Infinity, ease: "linear" } }
                : { scale: { duration: 0.3 }, rotate: { duration: 0.5 } }
            }
          />
          
          {/* Core orb */}
          <motion.div
            className="relative w-24 h-24 rounded-full shadow-lg"
            style={{
              background: `linear-gradient(145deg, hsl(var(--interu-blue)) 0%, hsl(var(--interu-purple)) 60%, hsl(var(--interu-coral)) 100%)`,
            }}
            animate={
              isActive
                ? { scale: [1, 1.05, 1] }
                : { scale: 1 }
            }
            transition={{
              duration: 1.5,
              repeat: isActive ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            {/* Inner highlight */}
            <div 
              className="absolute inset-2 rounded-full opacity-30"
              style={{
                background: "radial-gradient(circle at 30% 30%, white 0%, transparent 60%)",
              }}
            />
          </motion.div>

          {/* Pulse rings - only when active */}
          <PulseRings active={isActive} />
        </div>

        {/* Greeting */}
        <div className="text-center space-y-2 mt-6">
          <h3 className="text-xl font-semibold text-foreground">
            {isCompleted ? "Thank you!" : `Hi, ${participantName}!`}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {isCompleted
              ? "Your responses have been recorded"
              : state === "idle"
              ? "Ready when you are"
              : "Interview in progress"}
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 mt-4">
          <span className={cn("w-2 h-2 rounded-full", statusConfig[state].dotClass)} />
          <span className="text-sm text-muted-foreground font-medium">
            {statusConfig[state].label}
          </span>
        </div>

        {/* Current Question Card */}
        {currentQuestion && !isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-6"
          >
            <Card className="bg-background/50 border-border/30">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Current Question</p>
                <p className="text-foreground font-medium">{currentQuestion}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Call Button */}
        <motion.div className="mt-6" whileTap={{ scale: 0.95 }}>
          {state === "idle" && (
            <Button
              onClick={onStart}
              size="icon"
              className="w-16 h-16 rounded-full btn-gradient text-primary-foreground hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Phone className="w-6 h-6" />
            </Button>
          )}
          
          {isLoading && (
            <Button
              disabled
              size="icon"
              className="w-16 h-16 rounded-full btn-gradient text-primary-foreground shadow-lg"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-6 h-6" />
              </motion.div>
            </Button>
          )}
          
          {isActive && (
            <Button
              onClick={onEnd}
              size="icon"
              className="w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-all duration-300 shadow-lg"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
          )}
          
          {isCompleted && (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default PublicInterviewVoiceAgentCard;
