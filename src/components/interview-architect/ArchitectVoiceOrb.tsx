import { motion } from "framer-motion";
import { Mic, MicOff, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArchitectVoiceOrbProps {
  isListening: boolean;
  isProcessing: boolean;
  onToggle: () => void;
  className?: string;
}

const ArchitectVoiceOrb = ({
  isListening,
  isProcessing,
  onToggle,
  className,
}: ArchitectVoiceOrbProps) => {
  const isActive = isListening || isProcessing;

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Main orb button */}
      <motion.button
        onClick={onToggle}
        disabled={isProcessing}
        className={cn(
          "relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
          isProcessing
            ? "bg-primary/60 cursor-wait"
            : isListening
            ? "bg-primary shadow-glow"
            : "bg-muted hover:bg-muted/80"
        )}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulsing rings when active */}
        {isActive && (
          <>
            <motion.div
              className={cn(
                "absolute inset-0 rounded-full",
                isProcessing ? "bg-primary/20" : "bg-primary/30"
              )}
              animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className={cn(
                "absolute inset-0 rounded-full",
                isProcessing ? "bg-primary/10" : "bg-primary/20"
              )}
              animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
            />
          </>
        )}

        {isProcessing ? (
          <Sparkles className="w-6 h-6 text-primary-foreground relative z-10 animate-pulse" />
        ) : isListening ? (
          <Mic className="w-6 h-6 text-primary-foreground relative z-10" />
        ) : (
          <MicOff className="w-6 h-6 text-muted-foreground relative z-10" />
        )}
      </motion.button>

      {/* Status text */}
      <motion.p
        key={isProcessing ? "processing" : isListening ? "listening" : "idle"}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "text-xs font-medium",
          isProcessing
            ? "text-primary/80"
            : isListening
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        {isProcessing ? "Thinking..." : isListening ? "Listening..." : "Tap to speak"}
      </motion.p>

      {/* Audio waveform visualization */}
      {isListening && !isProcessing && (
        <div className="flex items-end gap-0.5 h-5">
          {[0.4, 0.7, 1, 0.5, 0.8, 0.3, 0.9].map((h, i) => (
            <motion.div
              key={i}
              className="w-1 bg-primary/60 rounded-full"
              animate={{ height: [3, h * 20, 3] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.07,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchitectVoiceOrb;
