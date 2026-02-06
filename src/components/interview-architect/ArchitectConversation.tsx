import { motion } from "framer-motion";
import { Mic, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ArchitectMessage {
  id: string;
  role: "assistant" | "user" | "system";
  content: string;
  timestamp: Date;
  isThinking?: boolean;
}

interface ArchitectConversationProps {
  messages: ArchitectMessage[];
  className?: string;
}

const ArchitectConversation = ({ messages, className }: ArchitectConversationProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      {messages.map((message, index) => {
        const isAssistant = message.role === "assistant";
        const isSystem = message.role === "system";

        if (isSystem) {
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className="flex justify-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-xs text-muted-foreground">{message.content}</span>
              </div>
            </motion.div>
          );
        }

        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={cn(
              "flex gap-3",
              isAssistant ? "justify-start" : "justify-end"
            )}
          >
            {isAssistant && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            )}

            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3",
                isAssistant
                  ? "bg-card border border-border shadow-sm"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {message.isThinking ? (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary/40"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">Analyzing...</span>
                </div>
              ) : (
                <>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={cn(
                      "text-xs mt-1.5",
                      isAssistant ? "text-muted-foreground" : "text-primary-foreground/70"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </>
              )}
            </div>

            {!isAssistant && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default ArchitectConversation;
