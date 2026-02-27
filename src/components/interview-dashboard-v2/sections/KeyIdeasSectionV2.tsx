import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface KeyIdeaInput {
  text?: string;
  priority?: number;
}

interface KeyIdeasSectionV2Props {
  data: (string | KeyIdeaInput)[];
}

const IDEA_ACCENTS = [
  { bg: "hsl(var(--primary) / 0.08)", border: "hsl(var(--primary) / 0.15)", icon: "hsl(var(--primary))" },
  { bg: "hsl(var(--interu-purple) / 0.08)", border: "hsl(var(--interu-purple) / 0.15)", icon: "hsl(var(--interu-purple))" },
  { bg: "hsl(var(--accent) / 0.08)", border: "hsl(var(--accent) / 0.15)", icon: "hsl(var(--accent))" },
  { bg: "hsl(var(--interu-mint) / 0.08)", border: "hsl(var(--interu-mint) / 0.15)", icon: "hsl(var(--interu-mint))" },
];

const getAccent = (i: number) => IDEA_ACCENTS[i % IDEA_ACCENTS.length];

export const KeyIdeasSectionV2 = ({ data }: KeyIdeasSectionV2Props) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const ideas = data.map((idea) => (typeof idea === "string" ? { text: idea } : idea));

  return (
    <section className="py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 mb-6"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.1)" }}>
          <Lightbulb className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Key Insights</h2>
      </motion.div>

      <div className="space-y-0">
        {ideas.map((idea, i) => {
          const accent = getAccent(i);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex gap-4"
            >
              {/* Left: number + connector */}
              <div className="flex flex-col items-center">
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: accent.bg, color: accent.icon, border: `1.5px solid ${accent.border}` }}
                >
                  {i + 1}
                </span>
                {i < ideas.length - 1 && (
                  <div className="w-px flex-1 min-h-[24px] bg-gradient-to-b from-border/40 to-border/10" />
                )}
              </div>
              {/* Right: text */}
              <div className="flex-1 pb-6">
                <p className="text-sm leading-relaxed text-foreground/80 pt-1.5">{idea.text}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default KeyIdeasSectionV2;
