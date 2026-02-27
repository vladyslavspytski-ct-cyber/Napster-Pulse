import { motion } from "framer-motion";
import { Hash } from "lucide-react";

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
  { bg: "hsl(var(--primary) / 0.12)", border: "hsl(var(--primary) / 0.25)", text: "hsl(var(--primary))", glow: "hsl(var(--primary) / 0.08)" },
  { bg: "hsl(var(--interu-purple) / 0.12)", border: "hsl(var(--interu-purple) / 0.25)", text: "hsl(var(--interu-purple))", glow: "hsl(var(--interu-purple) / 0.08)" },
  { bg: "hsl(var(--accent) / 0.12)", border: "hsl(var(--accent) / 0.25)", text: "hsl(var(--accent))", glow: "hsl(var(--accent) / 0.08)" },
  { bg: "hsl(var(--interu-mint) / 0.12)", border: "hsl(var(--interu-mint) / 0.25)", text: "hsl(var(--interu-mint))", glow: "hsl(var(--interu-mint) / 0.08)" },
  { bg: "hsl(var(--destructive) / 0.10)", border: "hsl(var(--destructive) / 0.20)", text: "hsl(var(--destructive))", glow: "hsl(var(--destructive) / 0.06)" },
];

const getAccent = (i: number) => THEME_ACCENTS[i % THEME_ACCENTS.length];

const frequencyToSize = (frequency?: string): "lg" | "md" | "sm" => {
  if (!frequency) return "md";
  const l = frequency.toLowerCase();
  if (l === "high") return "lg";
  if (l === "medium") return "md";
  return "sm";
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

      <div className="flex flex-wrap gap-3">
        {data.map((theme, i) => {
          const accent = getAccent(i);
          const size = frequencyToSize(theme.frequency);

          const sizeClasses = {
            lg: "px-5 py-3.5 text-sm",
            md: "px-4 py-3 text-sm",
            sm: "px-3.5 py-2.5 text-xs",
          }[size];

          return (
            <motion.div
              key={`${theme.theme}-${i}`}
              initial={{ opacity: 0, scale: 0.85, y: 12 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.04, y: -2 }}
              className={`group relative rounded-2xl font-semibold cursor-default transition-shadow ${sizeClasses}`}
              style={{
                backgroundColor: accent.bg,
                border: `1px solid ${accent.border}`,
                color: accent.text,
              }}
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: `0 8px 30px ${accent.glow}` }}
              />
              <span className="relative z-10">{theme.theme}</span>
              
              {/* Frequency dot indicator instead of text */}
              {theme.frequency && (
                <span className="relative z-10 ml-2 inline-flex">
                  {Array.from({ length: size === "lg" ? 3 : size === "md" ? 2 : 1 }).map((_, j) => (
                    <span
                      key={j}
                      className="w-1.5 h-1.5 rounded-full ml-0.5 first:ml-0"
                      style={{ backgroundColor: accent.text, opacity: 0.6 + j * 0.15 }}
                    />
                  ))}
                </span>
              )}

              {/* Tooltip-style description on hover */}
              {theme.description && (
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-xs font-normal text-foreground/80 bg-card border border-border/60 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap max-w-[260px] truncate z-20"
                >
                  {theme.description}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default RecurringThemesSectionV2;
