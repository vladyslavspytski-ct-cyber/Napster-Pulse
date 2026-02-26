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

const pop = (delay = 0) => ({
  initial: { opacity: 0, y: 24, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

interface StatsCardsSectionProps {
  data: StatCard[];
}

// Pattern-to-icon mapping for stat labels with colors
type IconPattern = {
  patterns: string[];
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
};

const iconMappings: IconPattern[] = [
  { patterns: ["total", "respondent", "participant", "candidate", "user", "people"], icon: Users, iconColor: "text-blue-600", bgColor: "bg-blue-500/10" },
  { patterns: ["average", "avg", "mean"], icon: TrendingUp, iconColor: "text-emerald-600", bgColor: "bg-emerald-500/10" },
  { patterns: ["top", "highest", "best", "max", "peak"], icon: Crown, iconColor: "text-amber-500", bgColor: "bg-amber-500/10" },
  { patterns: ["lowest", "min", "worst", "bottom"], icon: TrendingDown, iconColor: "text-rose-500", bgColor: "bg-rose-500/10" },
  { patterns: ["rate", "%", "percent", "ratio"], icon: Percent, iconColor: "text-violet-600", bgColor: "bg-violet-500/10" },
  { patterns: ["risk", "flag", "issue", "warning", "alert"], icon: AlertTriangle, iconColor: "text-orange-500", bgColor: "bg-orange-500/10" },
  { patterns: ["duration", "time", "hours", "minutes", "days"], icon: Clock, iconColor: "text-cyan-600", bgColor: "bg-cyan-500/10" },
  { patterns: ["sentiment", "feedback", "review", "comment"], icon: MessageCircle, iconColor: "text-pink-500", bgColor: "bg-pink-500/10" },
];

// Default styling for fallback icon
const defaultIconStyle = {
  icon: BarChart3,
  iconColor: "text-primary",
  bgColor: "bg-primary/8",
};

/**
 * Get appropriate icon and colors based on stat label.
 * Matches common semantic patterns to lucide-react icons with semantic colors.
 */
const getStatIconWithStyle = (label: string): { icon: LucideIcon; iconColor: string; bgColor: string } => {
  const normalizedLabel = label.toLowerCase();

  for (const mapping of iconMappings) {
    if (mapping.patterns.some((pattern) => normalizedLabel.includes(pattern))) {
      return { icon: mapping.icon, iconColor: mapping.iconColor, bgColor: mapping.bgColor };
    }
  }

  // Default fallback
  return defaultIconStyle;
};

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
          {data.map((s, i) => {
            const { icon: Icon, iconColor, bgColor } = getStatIconWithStyle(s.label);
            return (
              <motion.div key={s.label} {...pop(0.05 * i)} className="text-center space-y-1">
                {/* Icon container */}
                <div className="flex justify-center mb-2">
                  <span className={`w-9 h-9 rounded-full ${bgColor} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                  </span>
                </div>
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsCardsSection;
