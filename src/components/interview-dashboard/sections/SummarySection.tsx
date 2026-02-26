import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Users, ChevronDown, ChevronUp } from "lucide-react";

const pop = (delay = 0) => ({
  initial: { opacity: 0, y: 24, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

// Backend sends { text, overall_score?, overall_status? }
interface SummaryDataInput {
  text: string;
  overall_score?: number;
  overall_status?: string;
}

interface SummarySectionProps {
  data: SummaryDataInput;
  title: string;
  completedCount: number;
}

const LINE_CLAMP_LIMIT = 7;

export const SummarySection = ({ data, title, completedCount }: SummarySectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if text is long enough to need expansion
  // Approximate: average 80 chars per line, 7 lines = 560 chars
  const isLongText = data.text && data.text.length > 500;

  return (
    <section className="relative py-14 md:py-20 overflow-hidden">
      {/* Multi-layer gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-background to-interu-purple/[0.04]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/[0.04] blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-accent/[0.05] blur-[80px]" />

      <div className="px-4 sm:px-6 relative z-10 max-w-5xl mx-auto text-center">
        <motion.div {...pop(0)} className="space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/10 text-primary text-xs font-semibold mx-auto">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Insight Canvas
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            {title}
          </h1>

          {/* Summary text with expand/collapse */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={isExpanded ? "expanded" : "collapsed"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p
                  className={`text-sm md:text-base text-muted-foreground leading-relaxed text-left ${
                    !isExpanded && isLongText ? "line-clamp-[7]" : ""
                  }`}
                >
                  {data.text}
                </p>
              </motion.div>
            </AnimatePresence>

            {isLongText && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {isExpanded ? (
                  <>
                    Show less <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground pt-1">
            <span className="inline-flex items-center gap-1.5">
              <Users className="w-4 h-4" /> {completedCount} participants
            </span>
            {data.overall_status && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                {data.overall_status}
              </span>
            )}
          </div>
        </motion.div>

        {/* Giant score */}
        {data.overall_score !== undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mt-10 inline-flex items-baseline gap-2"
          >
            <span className="text-8xl md:text-9xl font-black tracking-tighter text-foreground/90 leading-none">
              {data.overall_score}
            </span>
            <span className="text-2xl md:text-3xl font-medium text-muted-foreground/50">/100</span>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SummarySection;
