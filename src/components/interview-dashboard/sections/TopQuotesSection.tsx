import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const pop = (delay = 0) => ({
  initial: { opacity: 0, y: 24, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

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

interface TopQuotesSectionProps {
  data: (string | TopQuoteInput)[];
}

const MAX_VISIBLE_ROWS = 3; // 3 rows x 2 columns = 6 items

export const TopQuotesSection = ({ data }: TopQuotesSectionProps) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  // Normalize data - handle string[], { quote, author, context }, or { text, participant }
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

  const hasMore = quotes.length > MAX_VISIBLE_ROWS * 2;

  return (
    <section className="section-container max-w-6xl mx-auto py-16">
      <motion.div {...pop(0)} className="flex items-center gap-2 mb-8">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Participant Voices</h2>
      </motion.div>

      {/* Scrollable container with max height */}
      <div className="relative">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
            hasMore ? "max-h-[680px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent" : ""
          }`}
        >
          {quotes.map((q, i) => (
            <motion.blockquote
              key={i}
              {...pop(0.08 * Math.min(i, 5))}
              className="relative p-6 rounded-2xl bg-card border border-border/40"
            >
              {/* Icon - positioned in corner, smaller */}
              <MessageCircle className="w-6 h-6 text-primary/10 absolute top-3 right-3 pointer-events-none" />
              {/* Quote text - with right padding to avoid icon */}
              <p className="text-sm leading-relaxed text-foreground/80 italic pr-8">
                "{q.text}"
              </p>
              {(q.author || q.context) && (
                <div className="mt-3 pt-3 border-t border-border/30">
                  {q.author && (
                    <p className="text-xs font-semibold text-foreground">— {q.author}</p>
                  )}
                  {q.context && (
                    <p className="text-xs text-muted-foreground mt-1">{q.context}</p>
                  )}
                </div>
              )}
            </motion.blockquote>
          ))}
        </div>

        {/* Bottom blur gradient to indicate more content */}
        {hasMore && (
          <div className="absolute bottom-0 left-0 right-2 h-16 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
        )}
      </div>

      {hasMore && (
        <p className="text-center text-xs text-muted-foreground mt-2">
          Scroll to see {quotes.length - MAX_VISIBLE_ROWS * 2} more quotes
        </p>
      )}
    </section>
  );
};

export default TopQuotesSection;
