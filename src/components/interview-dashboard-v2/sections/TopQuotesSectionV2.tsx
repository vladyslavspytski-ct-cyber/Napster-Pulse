import { motion } from "framer-motion";
import { MessageCircle, Quote } from "lucide-react";

interface TopQuoteInput {
  quote?: string;
  text?: string;
  author?: string;
  participant?: string;
  context?: string;
}

interface TopQuotesSectionV2Props {
  data: (string | TopQuoteInput)[];
}

const ACCENT_GRADIENTS = [
  "from-primary/8 to-interu-purple/5",
  "from-interu-purple/8 to-primary/5",
  "from-accent/6 to-primary/4",
  "from-interu-mint/6 to-primary/4",
];

export const TopQuotesSectionV2 = ({ data }: TopQuotesSectionV2Props) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const quotes = data.map((q) => {
    if (typeof q === "string") return { text: q, author: undefined, context: undefined };
    return { text: q.quote ?? q.text ?? "", author: q.author ?? q.participant, context: q.context };
  });

  return (
    <section className="py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 mb-6"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--accent) / 0.1)" }}>
          <MessageCircle className="w-4 h-4 text-accent" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Participant Voices</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quotes.map((q, i) => (
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.06 * Math.min(i, 6) }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={`group relative p-5 rounded-2xl border border-border/30 bg-gradient-to-br ${ACCENT_GRADIENTS[i % ACCENT_GRADIENTS.length]} backdrop-blur-sm overflow-hidden cursor-default`}
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            {/* Small decorative quote mark */}
            <Quote
              className="absolute top-3 left-3 w-6 h-6 text-primary/[0.08] rotate-180 pointer-events-none"
              strokeWidth={1.5}
            />

            {/* Quote text */}
            <p className="relative text-sm md:text-base leading-relaxed text-foreground/85 italic z-10 pl-4">
              "{q.text}"
            </p>

            {(q.author || q.context) && (
              <div className="relative z-10 mt-4 pt-3 border-t border-border/20 flex items-center gap-3">
                {q.author && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-primary">
                        {q.author.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-foreground">{q.author}</span>
                  </div>
                )}
                {q.context && (
                  <span className="text-xs text-muted-foreground ml-auto">{q.context}</span>
                )}
              </div>
            )}

            {/* Hover glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ boxShadow: "inset 0 0 40px hsl(var(--primary) / 0.04)" }}
            />
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
};

export default TopQuotesSectionV2;
