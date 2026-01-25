import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AgentUIState = "disconnected" | "connecting" | "connected" | "disconnecting";

interface CreateInterviewVoiceAgentCardProps {
  agentName: string;
  agentDescription: string;
  state: AgentUIState;
  errorMessage?: string | null;
  inputLevel?: number;  // 0..1, drives orb animation
  outputLevel?: number; // 0..1, drives orb animation
  onToggle: () => void;
}

const statusConfig = {
  disconnected: { label: "Disconnected", dotClass: "bg-muted-foreground" },
  connecting: { label: "Connecting...", dotClass: "bg-yellow-500 animate-pulse" },
  connected: { label: "Connected", dotClass: "bg-green-500" },
  disconnecting: { label: "Disconnecting...", dotClass: "bg-yellow-500 animate-pulse" },
};

const CreateInterviewVoiceAgentCard = ({
  agentName,
  agentDescription,
  state,
  errorMessage,
  inputLevel = 0,
  outputLevel = 0,
  onToggle,
}: CreateInterviewVoiceAgentCardProps) => {
  const isLoading = state === "connecting" || state === "disconnecting";
  const isConnected = state === "connected";
  const combinedLevel = Math.max(inputLevel, outputLevel);
  
  // Orb scale based on audio levels
  const orbScale = 1 + combinedLevel * 0.15;
  const orbBlur = 60 + combinedLevel * 20;

  return (
    <Card className="w-full max-w-[650px] mx-auto glass-card border-border/50">
      <CardContent className="p-8 flex flex-col items-center justify-between min-h-[420px]">
        {/* Orb Visualization */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Outer glow layer */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-40"
            style={{
              background: `radial-gradient(circle, hsl(var(--interu-purple-light)) 0%, transparent 70%)`,
              filter: `blur(${orbBlur}px)`,
            }}
            animate={{
              scale: [orbScale, orbScale * 1.1, orbScale],
              opacity: isConnected ? [0.4, 0.6, 0.4] : 0.2,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
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
            animate={{
              scale: orbScale,
              rotate: [0, 360],
            }}
            transition={{
              scale: { duration: 0.3, ease: "easeOut" },
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            }}
          />
          
          {/* Core orb */}
          <motion.div
            className="relative w-24 h-24 rounded-full shadow-lg"
            style={{
              background: `linear-gradient(145deg, hsl(var(--interu-blue)) 0%, hsl(var(--interu-purple)) 60%, hsl(var(--interu-coral)) 100%)`,
            }}
            animate={{
              scale: isConnected ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
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
          
          {/* Pulse rings when connected */}
          <AnimatePresence>
            {isConnected && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-interu-purple/30"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-interu-blue/30"
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                />
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Agent Info */}
        <div className="text-center space-y-2 mt-6">
          <h3 className="text-xl font-semibold text-foreground">{agentName}</h3>
          <p className="text-sm text-muted-foreground max-w-xs">{agentDescription}</p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 mt-4">
          <span className={cn("w-2 h-2 rounded-full", statusConfig[state].dotClass)} />
          <span className="text-sm text-muted-foreground font-medium">
            {statusConfig[state].label}
          </span>
        </div>

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
        <motion.div className="mt-6" whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onToggle}
            disabled={isLoading}
            size="icon"
            className={cn(
              "w-16 h-16 rounded-full transition-all duration-300 shadow-lg",
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

export default CreateInterviewVoiceAgentCard;

/*
 * Usage Example:
 * 
 * import CreateInterviewVoiceAgentCard from "@/components/CreateInterviewVoiceAgentCard";
 * import { useState } from "react";
 * 
 * const MyComponent = () => {
 *   const [state, setState] = useState<"disconnected" | "connecting" | "connected" | "disconnecting">("disconnected");
 *   const [inputLevel, setInputLevel] = useState(0);
 *   const [outputLevel, setOutputLevel] = useState(0);
 * 
 *   const handleToggle = () => {
 *     if (state === "disconnected") {
 *       setState("connecting");
 *       // Simulate connection...
 *       setTimeout(() => setState("connected"), 2000);
 *     } else if (state === "connected") {
 *       setState("disconnecting");
 *       setTimeout(() => setState("disconnected"), 1000);
 *     }
 *   };
 * 
 *   return (
 *     <CreateInterviewVoiceAgentCard
 *       agentName="Interview Assistant"
 *       agentDescription="I'll help you create interview questions by listening to your voice."
 *       state={state}
 *       inputLevel={inputLevel}
 *       outputLevel={outputLevel}
 *       onToggle={handleToggle}
 *       errorMessage={null}
 *     />
 *   );
 * };
 */
