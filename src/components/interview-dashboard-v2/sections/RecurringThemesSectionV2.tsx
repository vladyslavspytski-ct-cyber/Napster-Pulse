import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, TrendingUp, TrendingDown, Minus, ChevronDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RecurringThemeInput {
  theme: string;
  frequency?: string;
  weight?: number;
  description?: string;
}

interface RecurringThemesSectionV2Props {
  data: RecurringThemeInput[];
}

const THEME_ACCENTS = [
  { bg: "hsl(var(--primary) / 0.08)", border: "hsl(var(--primary) / 0.18)", text: "hsl(var(--primary))", dot: "hsl(var(--primary))" },
  { bg: "hsl(var(--interu-purple) / 0.08)", border: "hsl(var(--interu-purple) / 0.18)", text: "hsl(var(--interu-purple))", dot: "hsl(var(--interu-purple))" },
  { bg: "hsl(var(--accent) / 0.08)", border: "hsl(var(--accent) / 0.18)", text: "hsl(var(--accent))", dot: "hsl(var(--accent))" },
  { bg: "hsl(var(--interu-mint) / 0.08)", border: "hsl(var(--interu-mint) / 0.18)", text: "hsl(var(--interu-mint))", dot: "hsl(var(--interu-mint))" },
  { bg: "hsl(var(--destructive) / 0.06)", border: "hsl(var(--destructive) / 0.15)", text: "hsl(var(--destructive))", dot: "hsl(var(--destructive))" },
];

const getAccent = (i: number) => THEME_ACCENTS[i % THEME_ACCENTS.length];

const FrequencyIcon = ({ frequency }: { frequency?: string }) => {
  if (!frequency) return <Minus className="w-3.5 h-3.5" />;
  const l = frequency.toLowerCase();
  if (l === "high") return <TrendingUp className="w-3.5 h-3.5" />;
  if (l === "low") return <TrendingDown className="w-3.5 h-3.5" />;
  return <Minus className="w-3.5 h-3.5" />;
};

const frequencyLabel = (frequency?: string): string => {
  if (!frequency) return "Moderate";
  const l = frequency.toLowerCase();
  if (l === "high") return "High frequency";
  if (l === "medium") return "Moderate";
  if (l === "low") return "Low frequency";
  return frequency;
};

const ThemeCard = ({ theme, index }: { theme: RecurringThemeInput; index: number }) => {
  const accent = getAccent(index);
  const [expanded, setExpanded] = useState(false);
  const hasLongDesc = (theme.description?.length ?? 0) > 80;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl p-4 cursor-default transition-shadow flex flex-col"
      style={{
        backgroundColor: accent.bg,
        border: `1px solid ${accent.border}`,
      }}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div
          className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
          style={{ backgroundColor: accent.dot }}
        />
        <div className="flex-1 min-w-0">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-3">
                  {theme.theme}
                </h3>
              </TooltipTrigger>
              {theme.theme.length > 60 && (
                <TooltipContent side="top" className="max-w-xs text-xs">
                  {theme.theme}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Description — truncated, expandable on click or tooltip on hover */}
      {theme.description && (
        <div className="mt-2 flex-1">
          <TooltipProvider delayDuration={400}>
            <Tooltip>
              <TooltipTrigger asChild>
                <p
                  className={`text-xs text-muted-foreground leading-relaxed ${
                    expanded ? "" : "line-clamp-2"
                  }`}
                >
                  {theme.description}
                </p>
              </TooltipTrigger>
              {hasLongDesc && !expanded && (
                <TooltipContent side="bottom" className="max-w-sm text-xs leading-relaxed">
                  {theme.description}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          {hasLongDesc && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[10px] font-medium mt-1 flex items-center gap-0.5 transition-colors"
              style={{ color: accent.text }}
            >
              {expanded ? "Less" : "More"}
              <ChevronDown
                className="w-3 h-3 transition-transform"
                style={{ transform: expanded ? "rotate(180deg)" : undefined }}
              />
            </button>
          )}
        </div>
      )}

      {/* Frequency indicator */}
      <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t" style={{ borderColor: accent.border }}>
        <span style={{ color: accent.text }}>
          <FrequencyIcon frequency={theme.frequency} />
        </span>
        <span className="text-[11px] font-medium" style={{ color: accent.text }}>
          {frequencyLabel(theme.frequency)}
        </span>
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `0 6px 24px ${accent.bg}` }}
      />
    </motion.div>
  );
};

export const RecurringThemesSectionV2 = ({ data }: RecurringThemesSectionV2Props) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

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
          <Hash className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Recurring Themes</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((theme, i) => (
          <ThemeCard key={`${theme.theme}-${i}`} theme={theme} index={i} />
        ))}
      </div>
    </section>
  );
};

export default RecurringThemesSectionV2;
