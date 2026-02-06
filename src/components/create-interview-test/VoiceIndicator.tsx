import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceIndicatorProps {
  isListening: boolean;
  onToggle: () => void;
  className?: string;
}

const VoiceIndicator = ({ isListening, onToggle, className }: VoiceIndicatorProps) => {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Main orb button */}
      <motion.button
        onClick={onToggle}
        className={cn(
          "relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
          isListening
            ? "bg-primary shadow-glow"
            : "bg-muted hover:bg-muted/80"
        )}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulsing rings when listening */}
        {isListening && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/30"
              animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
            />
          </>
        )}

        {isListening ? (
          <Mic className="w-7 h-7 text-primary-foreground relative z-10" />
        ) : (
          <MicOff className="w-7 h-7 text-muted-foreground relative z-10" />
        )}
      </motion.button>

      {/* Status text */}
      <motion.p
        key={isListening ? "listening" : "idle"}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "text-sm font-medium",
          isListening ? "text-primary" : "text-muted-foreground"
        )}
      >
        {isListening ? "Listening..." : "Tap to speak"}
      </motion.p>

      {/* Audio waveform visualization (mock) */}
      {isListening && (
        <div className="flex items-end gap-0.5 h-6">
          {[0.4, 0.7, 1, 0.5, 0.8, 0.3, 0.9, 0.6, 0.4].map((h, i) => (
            <motion.div
              key={i}
              className="w-1 bg-primary/60 rounded-full"
              animate={{ height: [4, h * 24, 4] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.08,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceIndicator;
