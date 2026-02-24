import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AIInsightBlockProps {
  insight: string;
}

const AIInsightBlock = ({ insight }: AIInsightBlockProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="relative overflow-hidden rounded-xl border border-primary/10 bg-card/60 backdrop-blur-sm p-5 md:p-6"
  >
    {/* Subtle gradient accent */}
    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-interu-purple to-accent opacity-60" />

    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-primary" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          AI Insight
        </p>
        <p className="text-sm leading-relaxed text-foreground/80">
          {insight}
        </p>
      </div>
    </div>
  </motion.div>
);

export default AIInsightBlock;
