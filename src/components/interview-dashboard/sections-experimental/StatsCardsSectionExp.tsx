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

interface StatsCardsSectionExpProps {
  data: StatCard[];
}

// Pattern-to-icon mapping with vibrant colors
type IconPattern = {
  patterns: string[];
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
};

const iconMappings: IconPattern[] = [
  { patterns: ["total", "respondent", "participant", "candidate", "user", "people"], icon: Users, gradient: "from-blue-500 to-cyan-500", iconColor: "text-white" },
  { patterns: ["average", "avg", "mean"], icon: TrendingUp, gradient: "from-emerald-500 to-teal-500", iconColor: "text-white" },
  { patterns: ["top", "highest", "best", "max", "peak"], icon: Crown, gradient: "from-amber-500 to-orange-500", iconColor: "text-white" },
  { patterns: ["lowest", "min", "worst", "bottom"], icon: TrendingDown, gradient: "from-rose-500 to-red-500", iconColor: "text-white" },
  { patterns: ["rate", "%", "percent", "ratio"], icon: Percent, gradient: "from-violet-500 to-purple-500", iconColor: "text-white" },
  { patterns: ["risk", "flag", "issue", "warning", "alert"], icon: AlertTriangle, gradient: "from-orange-500 to-amber-500", iconColor: "text-white" },
  { patterns: ["duration", "time", "hours", "minutes", "days"], icon: Clock, gradient: "from-cyan-500 to-blue-500", iconColor: "text-white" },
  { patterns: ["sentiment", "feedback", "review", "comment"], icon: MessageCircle, gradient: "from-pink-500 to-rose-500", iconColor: "text-white" },
];

const defaultIconStyle = {
  icon: BarChart3,
  gradient: "from-primary to-interu-purple",
  iconColor: "text-white",
};

const getStatIconWithStyle = (label: string) => {
  const normalizedLabel = label.toLowerCase();
  for (const mapping of iconMappings) {
    if (mapping.patterns.some((pattern) => normalizedLabel.includes(pattern))) {
      return { icon: mapping.icon, gradient: mapping.gradient, iconColor: mapping.iconColor };
    }
  }
  return defaultIconStyle;
};

export const StatsCardsSectionExp = ({ data }: StatsCardsSectionExpProps) => {
  if (!data || data.length === 0) return null;

  // Determine grid columns based on item count
  const getGridCols = (count: number) => {
    if (count <= 2) return "grid-cols-1 sm:grid-cols-2";
    if (count === 3) return "grid-cols-1 sm:grid-cols-3";
    if (count === 4) return "grid-cols-2 md:grid-cols-4";
    if (count === 5) return "grid-cols-2 sm:grid-cols-3 md:grid-cols-5";
    return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";
  };

  return (
    <section className="relative py-8 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-r from-card/50 via-background to-card/50" />

      <div className="section-container max-w-7xl mx-auto relative z-10">
        <div className={`grid ${getGridCols(data.length)} gap-4 md:gap-6`}>
          {data.map((s, i) => {
            const { icon: Icon, gradient, iconColor } = getStatIconWithStyle(s.label);

            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, type: "spring" }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative group"
              >
                <div className="relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/40 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  {/* Icon with gradient background */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="text-left">
                    <p className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                      {s.value}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                      {s.label}
                    </p>
                    {s.change && (
                      <p
                        className={`text-xs font-semibold inline-flex items-center gap-0.5 mt-1 ${
                          s.trend === "up"
                            ? "text-emerald-500"
                            : s.trend === "down"
                              ? "text-rose-500"
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
                  </div>

                  {/* Hover glow */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsCardsSectionExp;
