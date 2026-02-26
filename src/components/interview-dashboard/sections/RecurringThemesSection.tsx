import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, ChevronDown, ChevronUp } from "lucide-react";

const pop = (delay = 0) => ({
  initial: { opacity: 0, y: 24, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

// Backend sends { theme, frequency, description } where frequency is "High" | "Medium" | "Low"
interface RecurringThemeInput {
  theme: string;
  frequency?: string;
  weight?: number;
  description?: string;
}

interface RecurringThemesSectionProps {
  data: RecurringThemeInput[];
}

// Map frequency string to numeric weight for display
const frequencyToWeight = (frequency?: string): number => {
  if (!frequency) return 50;
  const lower = frequency.toLowerCase();
  if (lower === "high") return 100;
  if (lower === "medium") return 66;
  if (lower === "low") return 33;
  return 50;
};

// Map frequency to color
const frequencyToColor = (frequency?: string): string => {
  if (!frequency) return "bg-primary";
  const lower = frequency.toLowerCase();
  if (lower === "high") return "bg-primary";
  if (lower === "medium") return "bg-interu-purple";
  if (lower === "low") return "bg-muted-foreground";
  return "bg-primary";
};

const MAX_VISIBLE = 4;

export const RecurringThemesSection = ({ data }: RecurringThemesSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const hasMore = data.length > MAX_VISIBLE;
  const visibleThemes = isExpanded ? data : data.slice(0, MAX_VISIBLE);

  return (
    <section className="section-container max-w-6xl mx-auto py-16">
      <motion.div {...pop(0)} className="flex items-center gap-2 mb-8">
        <Hash className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Recurring Themes</h2>
      </motion.div>
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="sync">
          {visibleThemes.map((theme, i) => {
            const weight = theme.weight ?? frequencyToWeight(theme.frequency);
            const colorClass = frequencyToColor(theme.frequency);
            return (
              <motion.div
                key={`${theme.theme}-${i}`}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.3, delay: i < MAX_VISIBLE ? 0.05 * i : 0.05 * (i - MAX_VISIBLE) }}
                className="p-5 rounded-xl bg-card border border-border/40"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className="text-base font-semibold text-foreground">{theme.theme}</span>
                  {theme.frequency && (
                    <span
                      className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        theme.frequency.toLowerCase() === "high"
                          ? "bg-primary/10 text-primary"
                          : theme.frequency.toLowerCase() === "medium"
                            ? "bg-interu-purple/10 text-interu-purple"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {theme.frequency}
                    </span>
                  )}
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-3">
                  <motion.div
                    className={`h-full rounded-full ${colorClass}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${weight}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 + i * 0.05 }}
                  />
                </div>
                {theme.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{theme.description}</p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {hasMore && (
        <motion.button
          {...pop(0.2)}
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 mx-auto flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {isExpanded ? (
            <>
              Show less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show {data.length - MAX_VISIBLE} more <ChevronDown className="w-4 h-4" />
            </>
          )}
        </motion.button>
      )}
    </section>
  );
};

export default RecurringThemesSection;
