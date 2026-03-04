import { motion } from "framer-motion";
import { Hash, TrendingUp } from "lucide-react";

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

interface RecurringThemesSectionExpProps {
  data: RecurringThemeInput[];
}

// Color palette for themes - vibrant, modern colors
const THEME_COLORS = [
  { bg: "from-violet-500/20 to-purple-500/10", border: "border-violet-400/30", text: "text-violet-300", glow: "shadow-violet-500/20" },
  { bg: "from-cyan-500/20 to-blue-500/10", border: "border-cyan-400/30", text: "text-cyan-300", glow: "shadow-cyan-500/20" },
  { bg: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-400/30", text: "text-emerald-300", glow: "shadow-emerald-500/20" },
  { bg: "from-amber-500/20 to-orange-500/10", border: "border-amber-400/30", text: "text-amber-300", glow: "shadow-amber-500/20" },
  { bg: "from-rose-500/20 to-pink-500/10", border: "border-rose-400/30", text: "text-rose-300", glow: "shadow-rose-500/20" },
  { bg: "from-indigo-500/20 to-blue-500/10", border: "border-indigo-400/30", text: "text-indigo-300", glow: "shadow-indigo-500/20" },
  { bg: "from-fuchsia-500/20 to-purple-500/10", border: "border-fuchsia-400/30", text: "text-fuchsia-300", glow: "shadow-fuchsia-500/20" },
  { bg: "from-lime-500/20 to-green-500/10", border: "border-lime-400/30", text: "text-lime-300", glow: "shadow-lime-500/20" },
];

// Map frequency to visual intensity
const frequencyToSize = (frequency?: string): "lg" | "md" | "sm" => {
  if (!frequency) return "md";
  const lower = frequency.toLowerCase();
  if (lower === "high") return "lg";
  if (lower === "medium") return "md";
  return "sm";
};

const sizeClasses = {
  lg: "p-6 text-lg",
  md: "p-5 text-base",
  sm: "p-4 text-sm",
};

export const RecurringThemesSectionExp = ({ data }: RecurringThemesSectionExpProps) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-interu-purple/[0.03]" />

      <div className="section-container max-w-7xl mx-auto relative z-10">
        <motion.div {...pop(0)} className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-interu-purple/20 flex items-center justify-center">
            <Hash className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Recurring Themes</h2>
            <p className="text-sm text-muted-foreground">Key patterns identified across responses</p>
          </div>
        </motion.div>

        {/* Theme cards in a flowing grid */}
        <div className="flex flex-wrap gap-4">
          {data.map((theme, i) => {
            const colorSet = THEME_COLORS[i % THEME_COLORS.length];
            const size = frequencyToSize(theme.frequency);
            const isHighFreq = theme.frequency?.toLowerCase() === "high";

            return (
              <motion.div
                key={`${theme.theme}-${i}`}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className={`
                  relative group cursor-default
                  rounded-2xl border backdrop-blur-sm
                  bg-gradient-to-br ${colorSet.bg} ${colorSet.border}
                  ${sizeClasses[size]}
                  ${isHighFreq ? `shadow-lg ${colorSet.glow}` : ""}
                  transition-all duration-300
                `}
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorSet.bg} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10`} />

                {/* High frequency indicator */}
                {isHighFreq && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                )}

                {/* Theme name */}
                <span className="font-semibold text-foreground block mb-1">
                  {theme.theme}
                </span>

                {/* Description if available */}
                {theme.description && (
                  <p className="text-xs text-muted-foreground/80 mt-2 leading-relaxed line-clamp-2">
                    {theme.description}
                  </p>
                )}

                {/* Visual frequency indicator - subtle dots */}
                <div className="flex gap-1 mt-3">
                  {[...Array(3)].map((_, dotIdx) => (
                    <div
                      key={dotIdx}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        (theme.frequency?.toLowerCase() === "high" && dotIdx <= 2) ||
                        (theme.frequency?.toLowerCase() === "medium" && dotIdx <= 1) ||
                        (theme.frequency?.toLowerCase() === "low" && dotIdx === 0)
                          ? "bg-current opacity-60"
                          : "bg-current opacity-20"
                      }`}
                      style={{ color: "currentColor" }}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecurringThemesSectionExp;
