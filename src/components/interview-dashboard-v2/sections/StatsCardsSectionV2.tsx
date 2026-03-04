import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Crown,
  Percent,
  AlertTriangle,
  Clock,
  MessageCircle,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import type { StatCard } from "@/hooks/api/useInterviewDashboard";

interface StatsCardsSectionV2Props {
  data: StatCard[];
}

const CARD_ACCENTS = [
  { bg: "hsl(var(--primary) / 0.07)", border: "hsl(var(--primary) / 0.14)", color: "hsl(var(--primary))" },
  { bg: "hsl(var(--interu-purple) / 0.07)", border: "hsl(var(--interu-purple) / 0.14)", color: "hsl(var(--interu-purple))" },
  { bg: "hsl(var(--accent) / 0.07)", border: "hsl(var(--accent) / 0.14)", color: "hsl(var(--accent))" },
  { bg: "hsl(var(--interu-mint) / 0.07)", border: "hsl(var(--interu-mint) / 0.14)", color: "hsl(var(--interu-mint))" },
  { bg: "hsl(var(--destructive) / 0.06)", border: "hsl(var(--destructive) / 0.12)", color: "hsl(var(--destructive))" },
];

type IconPattern = {
  patterns: string[];
  icon: LucideIcon;
};

const iconMappings: IconPattern[] = [
  { patterns: ["total", "respondent", "participant", "candidate", "user", "people"], icon: Users },
  { patterns: ["average", "avg", "mean"], icon: TrendingUp },
  { patterns: ["top", "highest", "best", "max", "peak"], icon: Crown },
  { patterns: ["lowest", "min", "worst", "bottom"], icon: TrendingDown },
  { patterns: ["rate", "%", "percent", "ratio"], icon: Percent },
  { patterns: ["risk", "flag", "issue", "warning", "alert"], icon: AlertTriangle },
  { patterns: ["duration", "time", "hours", "minutes", "days"], icon: Clock },
  { patterns: ["sentiment", "feedback", "review", "comment"], icon: MessageCircle },
];

const getStatIcon = (label: string): LucideIcon => {
  const l = label.toLowerCase();
  for (const m of iconMappings) {
    if (m.patterns.some((p) => l.includes(p))) return m.icon;
  }
  return BarChart3;
};

const getGridClasses = (count: number): string => {
  if (count <= 2) return "grid-cols-2";
  if (count === 3) return "grid-cols-3";
  if (count === 4) return "grid-cols-2 md:grid-cols-4";
  if (count === 5) return "grid-cols-2 md:grid-cols-5";
  return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
};

export const StatsCardsSectionV2 = ({ data }: StatsCardsSectionV2Props) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="py-4">
      <div className={`grid ${getGridClasses(data.length)} gap-3`}>
        {data.map((s, i) => {
          const Icon = getStatIcon(s.label);
          const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];

          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="relative rounded-2xl p-4 cursor-default transition-shadow overflow-hidden"
              style={{
                backgroundColor: accent.bg,
                border: `1px solid ${accent.border}`,
              }}
            >
              {/* Decorative icon bg */}
              <div className="absolute -top-2 -right-2 opacity-[0.06]">
                <Icon className="w-16 h-16" style={{ color: accent.color }} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: accent.border }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: accent.color }} />
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium truncate">
                    {s.label}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground tabular-nums">{s.value}</p>
                {s.change && (
                  <p
                    className="text-[11px] font-semibold inline-flex items-center gap-0.5 mt-1"
                    style={{
                      color:
                        s.trend === "up"
                          ? "hsl(var(--interu-mint))"
                          : s.trend === "down"
                            ? "hsl(var(--destructive))"
                            : "hsl(var(--muted-foreground))",
                    }}
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
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default StatsCardsSectionV2;
