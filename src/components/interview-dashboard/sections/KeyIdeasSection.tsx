import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

const pop = (delay = 0) => ({
  initial: { opacity: 0, y: 24, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

// Backend can send string[] or { text: string, priority?: number }[]
interface KeyIdeaInput {
  text?: string;
  priority?: number;
}

interface KeyIdeasSectionProps {
  data: (string | KeyIdeaInput)[];
}

export const KeyIdeasSection = ({ data }: KeyIdeasSectionProps) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  // Normalize data - can be string[] or KeyIdea[]
  const ideas = data.map((idea) => (typeof idea === "string" ? { text: idea } : idea));

  return (
    <section className="section-container max-w-6xl mx-auto pb-20">
      <motion.div {...pop(0)} className="flex items-center gap-2 mb-8">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Key Insights</h2>
      </motion.div>
      <div className="space-y-0">
        {ideas.map((idea, i) => (
          <motion.div
            key={i}
            {...pop(0.08 * i)}
            className="flex gap-4"
          >
            {/* Left column: circle + line */}
            <div className="flex flex-col items-center">
              {/* Number badge */}
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-bold text-primary">
                {i + 1}
              </span>
              {/* Connecting line (not on last item) */}
              {i < ideas.length - 1 && (
                <div className="w-px flex-1 min-h-[24px] bg-gradient-to-b from-primary/20 to-primary/5" />
              )}
            </div>
            {/* Right column: text content */}
            <div className="flex-1 pb-6">
              <p className="text-sm leading-relaxed text-foreground/80 pt-1.5">{idea.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default KeyIdeasSection;
