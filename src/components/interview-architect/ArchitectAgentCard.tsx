import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AgentState = "disconnected" | "connecting" | "connected" | "disconnecting";

interface ArchitectAgentCardProps {
  agentName: string;
  agentDescription: string;
  state: AgentState;
  helperText?: string;
  errorMessage?: string | null;
  inputLevel?: number;
  outputLevel?: number;
  onToggle: () => void;
}

const statusConfig = {
  disconnected: { label: "Ready", dotClass: "bg-muted-foreground" },
  connecting: { label: "Connecting...", dotClass: "bg-yellow-500 animate-pulse" },
  connected: { label: "Listening", dotClass: "bg-green-500" },
  disconnecting: { label: "Processing...", dotClass: "bg-yellow-500 animate-pulse" },
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
            transition: { duration: 0.08, ease: "easeOut", repeat: 0 },
          }}
        >
          <motion.div
            key="pulse-ring-1"
            className="absolute inset-0 rounded-full border-2 border-interu-purple/30"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 1.8], opacity: [0, 0.6, 0] }}
            exit={{
              opacity: 0,
              transition: { duration: 0.08, ease: "easeOut", repeat: 0 },
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
              transition: { duration: 0.08, ease: "easeOut", repeat: 0 },
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

const ArchitectAgentCard = ({
  agentName,
  agentDescription,
  state,
  helperText,
  errorMessage,
  inputLevel = 0,
  outputLevel = 0,
  onToggle,
}: ArchitectAgentCardProps) => {
  const isLoading = state === "connecting" || state === "disconnecting";
  const isConnected = state === "connected";
  const combinedLevel = Math.max(inputLevel, outputLevel);

  // Orb scale based on audio levels
  const orbScale = 1 + combinedLevel * 0.15;
  const orbBlur = 60 + combinedLevel * 20;

  return (
    <Card className="w-full glass-card border-border/50">
      <CardContent className="p-6 flex flex-col items-center">
        {/* Orb Visualization */}
        <div className="relative w-28 h-28 flex items-center justify-center overflow-visible m-4">
          {/* Outer glow layer */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, hsl(var(--interu-purple-light)) 0%, transparent 70%)`,
              filter: `blur(${isConnected ? orbBlur : 60}px)`,
            }}
            animate={
              isConnected
                ? { scale: [orbScale, orbScale * 1.1, orbScale], opacity: [0.4, 0.6, 0.4] }
                : { scale: 1, opacity: 0.2 }
            }
            transition={{
              duration: 2,
              repeat: isConnected ? Infinity : 0,
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
              isConnected
                ? { scale: orbScale, rotate: 360 }
                : { scale: 1, rotate: 0 }
            }
            transition={
              isConnected
                ? { scale: { duration: 0.3, ease: "easeOut" }, rotate: { duration: 20, repeat: Infinity, ease: "linear" } }
                : { scale: { duration: 0.3 }, rotate: { duration: 0.5 } }
            }
          />

          {/* Core orb */}
          <motion.div
            className="relative w-20 h-20 rounded-full shadow-lg"
            style={{
              background: `linear-gradient(145deg, hsl(var(--interu-blue)) 0%, hsl(var(--interu-purple)) 60%, hsl(var(--interu-coral)) 100%)`,
            }}
            animate={
              isConnected
                ? { scale: [1, 1.05, 1] }
                : { scale: 1 }
            }
            transition={{
              duration: 1.5,
              repeat: isConnected ? Infinity : 0,
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

          {/* Pulse rings - only when connected */}
          <PulseRings active={isConnected} />
        </div>

        {/* Agent Info */}
        <div className="text-center space-y-1.5 mt-4">
          <h3 className="text-lg font-semibold text-foreground">{agentName}</h3>
          <p className="text-sm text-muted-foreground max-w-xs">{agentDescription}</p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 mt-3">
          <span className={cn("w-2 h-2 rounded-full", statusConfig[state].dotClass)} />
          <span className="text-sm text-muted-foreground font-medium">
            {statusConfig[state].label}
          </span>
        </div>

        {/* Helper Text */}
        <AnimatePresence>
          {helperText && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-muted-foreground text-center mt-3 px-4"
            >
              {helperText}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {errorMessage && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-sm text-destructive text-center mt-2 px-4"
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Call Button */}
        <motion.div className="mt-5" whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onToggle}
            disabled={isLoading}
            size="icon"
            className={cn(
              "w-14 h-14 rounded-full transition-all duration-300 shadow-lg",
              isConnected
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                : "btn-gradient text-primary-foreground hover:scale-105"
            )}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  exit={{ opacity: 0 }}
                  transition={{ rotate: { duration: 1, repeat: Infinity, ease: "linear" } }}
                >
                  <Loader2 className="w-6 h-6" />
                </motion.div>
              ) : isConnected ? (
                <motion.div
                  key="hangup"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <PhoneOff className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="call"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Phone className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ArchitectAgentCard;
