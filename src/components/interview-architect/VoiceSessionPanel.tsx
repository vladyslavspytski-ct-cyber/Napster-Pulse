import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Sparkles, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type VoiceState = "idle" | "listening" | "thinking" | "suggesting";

interface VoiceSessionPanelProps {
  voiceState: VoiceState;
  currentPrompt: string;
  helperText?: string;
  onToggleVoice: () => void;
  className?: string;
}

const VoiceSessionPanel = ({
  voiceState,
  currentPrompt,
  helperText,
  onToggleVoice,
  className,
}: VoiceSessionPanelProps) => {
  const isActive = voiceState !== "idle";
  const isProcessing = voiceState === "thinking" || voiceState === "suggesting";

  const stateConfig = {
    idle: {
      label: "Tap to speak",
      bgClass: "bg-muted hover:bg-muted/80",
      iconClass: "text-muted-foreground",
      textClass: "text-muted-foreground",
    },
    listening: {
      label: "Listening...",
      bgClass: "bg-primary shadow-glow",
      iconClass: "text-primary-foreground",
      textClass: "text-primary",
    },
    thinking: {
      label: "Thinking...",
      bgClass: "bg-primary/60",
      iconClass: "text-primary-foreground",
      textClass: "text-primary/80",
    },
    suggesting: {
      label: "Generating questions...",
      bgClass: "bg-interu-mint shadow-[0_0_20px_hsl(var(--interu-mint)/0.3)]",
      iconClass: "text-white",
      textClass: "text-interu-mint",
    },
  };

  const config = stateConfig[voiceState];

  return (
    <div className={cn("glass-card rounded-2xl p-6", className)}>
      <div className="flex flex-col items-center text-center">
        {/* Voice Orb */}
        <motion.button
          onClick={onToggleVoice}
          disabled={isProcessing}
          className={cn(
            "relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
            config.bgClass,
            isProcessing && "cursor-wait"
          )}
          whileTap={{ scale: 0.95 }}
        >
          {/* Pulsing rings when active */}
          <AnimatePresence>
            {isActive && (
              <>
                <motion.div
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  className={cn(
                    "absolute inset-0 rounded-full",
                    voiceState === "suggesting" ? "bg-interu-mint/30" : "bg-primary/30"
                  )}
                />
                <motion.div
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                  className={cn(
                    "absolute inset-0 rounded-full",
                    voiceState === "suggesting" ? "bg-interu-mint/20" : "bg-primary/20"
                  )}
                />
              </>
            )}
          </AnimatePresence>

          {/* Icon */}
          {voiceState === "thinking" || voiceState === "suggesting" ? (
            <Sparkles className={cn("w-8 h-8 relative z-10 animate-pulse", config.iconClass)} />
          ) : voiceState === "listening" ? (
            <Mic className={cn("w-8 h-8 relative z-10", config.iconClass)} />
          ) : (
            <MicOff className={cn("w-8 h-8 relative z-10", config.iconClass)} />
          )}
        </motion.button>

        {/* Status label */}
        <motion.p
          key={voiceState}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("text-sm font-medium mt-4", config.textClass)}
        >
          {config.label}
        </motion.p>

        {/* Audio waveform */}
        <AnimatePresence>
          {voiceState === "listening" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-end justify-center gap-1 h-6 mt-3"
            >
              {[0.4, 0.7, 1, 0.5, 0.8, 0.3, 0.9, 0.6, 0.4].map((h, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary/60 rounded-full"
                  animate={{ height: [4, h * 24, 4] }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.07,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current prompt from assistant */}
        <AnimatePresence mode="wait">
          {currentPrompt && (
            <motion.div
              key={currentPrompt}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 p-4 rounded-xl bg-muted/50 border border-border max-w-md"
            >
              <p className="text-sm text-foreground leading-relaxed">{currentPrompt}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper text */}
        {helperText && (
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{helperText}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceSessionPanel;
