import { motion } from "framer-motion";
import { Clock, Target, MessageCircle, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface InterviewContext {
  type?: string;
  goal?: string;
  duration?: string;
  tone?: string;
}

interface InterviewContextBadgesProps {
  context: InterviewContext;
  className?: string;
}

const InterviewContextBadges = ({ context, className }: InterviewContextBadgesProps) => {
  const items = [
    { key: "type", icon: MessageCircle, value: context.type, label: "Type" },
    { key: "goal", icon: Target, value: context.goal, label: "Goal" },
    { key: "duration", icon: Clock, value: context.duration, label: "Time" },
    { key: "tone", icon: Shield, value: context.tone, label: "Tone" },
  ].filter((item) => item.value);

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Badge
              variant="outline"
              className="px-3 py-1.5 bg-card border-border text-foreground/80 font-normal"
            >
              <Icon className="w-3.5 h-3.5 mr-1.5 text-primary" />
              <span className="text-muted-foreground text-xs mr-1">{item.label}:</span>
              <span className="text-xs">{item.value}</span>
            </Badge>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default InterviewContextBadges;
