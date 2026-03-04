import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Zap, ChevronDown, ChevronUp } from "lucide-react";

interface KeyIdeaInput {
  text?: string;
  priority?: number;
}

interface KeyIdeasSectionExpProps {
  data: (string | KeyIdeaInput)[];
}

// Gradient colors for insight cards
const INSIGHT_GRADIENTS = [
  "from-violet-500/20 via-purple-500/10 to-transparent",
  "from-cyan-500/20 via-blue-500/10 to-transparent",
  "from-emerald-500/20 via-teal-500/10 to-transparent",
  "from-amber-500/20 via-orange-500/10 to-transparent",
  "from-rose-500/20 via-pink-500/10 to-transparent",
];

const INSIGHT_ACCENTS = [
  "bg-violet-500",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
];

// Individual card with expandable text
interface InsightCardProps {
  idea: { text?: string };
  index: number;
  gradientClass: string;
  accentClass: string;
}

const InsightCard = ({ idea, index, gradientClass, accentClass }: InsightCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Check if text is truncated
  useEffect(() => {
    const el = textRef.current;
    if (el) {
      // Compare scrollHeight with clientHeight to detect truncation
      setIsTruncated(el.scrollHeight > el.clientHeight + 2);
    }
  }, [idea.text]);

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20, y: 10 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`
        relative group
        p-6 rounded-2xl
        bg-gradient-to-br ${gradientClass}
        border border-border/40
        backdrop-blur-sm
        transition-all duration-300
      `}
    >
      {/* Number badge */}
      <div className="absolute -top-3 -left-2">
        <div className={`w-8 h-8 rounded-xl ${accentClass} flex items-center justify-center shadow-lg`}>
          <span className="text-sm font-bold text-white">{index + 1}</span>
        </div>
      </div>

      {/* Zap icon for important insights */}
      {index < 2 && (
        <Zap className="absolute top-4 right-4 w-5 h-5 text-amber-500/30" />
      )}

      {/* Content */}
      <p
        ref={textRef}
        className={`text-base leading-relaxed text-foreground/90 pl-4 pt-2 ${
          !isExpanded ? "line-clamp-4" : ""
        }`}
      >
        {idea.text}
      </p>

      {/* Read more/less button */}
      {isTruncated && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 ml-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
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

      {/* Hover effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

export const KeyIdeasSectionExp = ({ data }: KeyIdeasSectionExpProps) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const ideas = data.map((idea) => (typeof idea === "string" ? { text: idea } : idea));

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-interu-purple/[0.02]" />

      <div className="section-container max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Key Insights</h2>
            <p className="text-sm text-muted-foreground">Important findings from the analysis</p>
          </div>
        </motion.div>

        {/* Insights grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ideas.map((idea, i) => (
            <InsightCard
              key={i}
              idea={idea}
              index={i}
              gradientClass={INSIGHT_GRADIENTS[i % INSIGHT_GRADIENTS.length]}
              accentClass={INSIGHT_ACCENTS[i % INSIGHT_ACCENTS.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyIdeasSectionExp;
