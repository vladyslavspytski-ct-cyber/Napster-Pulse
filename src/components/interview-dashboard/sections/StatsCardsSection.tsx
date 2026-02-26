import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { StatCard } from "@/hooks/api/useInterviewDashboard";

const pop = (delay = 0) => ({
  initial: { opacity: 0, y: 24, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

interface StatsCardsSectionProps {
  data: StatCard[];
}

// Determine grid classes based on item count
const getGridClasses = (count: number): string => {
  if (count === 1) return "grid-cols-1 max-w-xs mx-auto";
  if (count === 2) return "grid-cols-2 max-w-md mx-auto";
  if (count === 3) return "grid-cols-3 max-w-2xl mx-auto";
  if (count === 4) return "grid-cols-2 md:grid-cols-4";
  if (count === 5) return "grid-cols-2 md:grid-cols-5";
  if (count === 6) return "grid-cols-2 md:grid-cols-3 lg:grid-cols-6";
  // 7+ items: wrap in rows
  return "grid-cols-2 md:grid-cols-4";
};

export const StatsCardsSection = ({ data }: StatsCardsSectionProps) => {
  if (!data || data.length === 0) return null;

  const gridClasses = getGridClasses(data.length);

  return (
    <section className="border-y border-border/50 bg-card/40">
      <div className="section-container max-w-6xl mx-auto py-6">
        <div className={`grid ${gridClasses} gap-6`}>
          {data.map((s, i) => (
            <motion.div key={s.label} {...pop(0.05 * i)} className="text-center space-y-1">
              <p className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">{s.value}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
              {s.change && (
                <p
                  className={`text-xs font-semibold inline-flex items-center gap-0.5 ${
                    s.trend === "up"
                      ? "text-emerald-600"
                      : s.trend === "down"
                        ? "text-primary"
                        : "text-muted-foreground"
                  }`}
                >
                  {s.trend === "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : s.trend === "down" ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                  {s.change}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCardsSection;
