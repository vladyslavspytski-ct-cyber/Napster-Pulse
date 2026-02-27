import { motion } from "framer-motion";
import { MessageCircle, Quote } from "lucide-react";

// Backend sends { quote, author, context }
// or could send { text, participant? }
// or could send plain strings
interface TopQuoteInput {
  quote?: string;
  text?: string;
  author?: string;
  participant?: string;
  context?: string;
}

interface TopQuotesSectionExpProps {
  data: (string | TopQuoteInput)[];
}

// Gradient accents for quote cards
const QUOTE_GRADIENTS = [
  "from-violet-500/10 via-purple-500/5 to-transparent",
  "from-cyan-500/10 via-blue-500/5 to-transparent",
  "from-emerald-500/10 via-teal-500/5 to-transparent",
  "from-amber-500/10 via-orange-500/5 to-transparent",
  "from-rose-500/10 via-pink-500/5 to-transparent",
  "from-indigo-500/10 via-blue-500/5 to-transparent",
];

const QUOTE_BORDERS = [
  "border-l-violet-500/50",
  "border-l-cyan-500/50",
  "border-l-emerald-500/50",
  "border-l-amber-500/50",
  "border-l-rose-500/50",
  "border-l-indigo-500/50",
];

export const TopQuotesSectionExp = ({ data }: TopQuotesSectionExpProps) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  // Normalize data
  const quotes = data.map((q) => {
    if (typeof q === "string") {
      return { text: q, author: undefined, context: undefined };
    }
    return {
      text: q.quote ?? q.text ?? "",
      author: q.author ?? q.participant,
      context: q.context,
    };
  });

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/[0.03] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-interu-purple/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="section-container max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-interu-purple/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Participant Voices</h2>
            <p className="text-sm text-muted-foreground">Direct quotes from interview responses</p>
          </div>
        </motion.div>

        {/* Quotes grid - always 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quotes.map((quote, i) => {
            const gradientClass = QUOTE_GRADIENTS[i % QUOTE_GRADIENTS.length];
            const borderClass = QUOTE_BORDERS[i % QUOTE_BORDERS.length];

            return (
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`
                  relative group
                  p-6 rounded-2xl
                  bg-gradient-to-br ${gradientClass}
                  border border-border/40 ${borderClass} border-l-4
                  backdrop-blur-sm
                  hover:border-border/60
                  transition-all duration-300
                `}
              >
                {/* Large decorative quote mark */}
                <Quote className="absolute top-4 right-4 w-12 h-12 text-primary/[0.07] transform rotate-180" />

                {/* Quote text */}
                <p className="relative text-base md:text-lg leading-relaxed text-foreground/90 italic pr-8">
                  "{quote.text}"
                </p>

                {/* Author and context */}
                {(quote.author || quote.context) && (
                  <div className="mt-5 pt-4 border-t border-border/30 flex items-center gap-3">
                    {/* Avatar placeholder */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-interu-purple/20 flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">
                        {quote.author?.[0]?.toUpperCase() || "P"}
                      </span>
                    </div>
                    <div>
                      {quote.author && (
                        <p className="text-sm font-semibold text-foreground">{quote.author}</p>
                      )}
                      {quote.context && (
                        <p className="text-xs text-muted-foreground">{quote.context}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.blockquote>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopQuotesSectionExp;
