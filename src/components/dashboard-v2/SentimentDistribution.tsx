import { motion } from "framer-motion";
import { TrendingUp, MessageSquare, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

interface SentimentDistributionProps {
  data?: SentimentData;
  className?: string;
}

// Hardcoded test values - will be replaced with backend data later
const DEFAULT_DATA: SentimentData = {
  positive: 78,
  neutral: 18,
  negative: 4,
};

const SentimentDistribution = ({ 
  data = DEFAULT_DATA, 
  className 
}: SentimentDistributionProps) => {
  const sentiments = [
    {
      key: "positive",
      label: "Positive",
      value: data.positive,
      icon: TrendingUp,
      bgClass: "bg-emerald-50 dark:bg-emerald-950/30",
      iconClass: "text-emerald-500",
      textClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      key: "neutral",
      label: "Neutral",
      value: data.neutral,
      icon: MessageSquare,
      bgClass: "bg-slate-100 dark:bg-slate-800/50",
      iconClass: "text-slate-500",
      textClass: "text-slate-600 dark:text-slate-400",
    },
    {
      key: "negative",
      label: "Negative",
      value: data.negative,
      icon: BarChart3,
      bgClass: "bg-rose-50 dark:bg-rose-950/30",
      iconClass: "text-rose-500",
      textClass: "text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div className={cn("grid grid-cols-3 gap-3", className)}>
      {sentiments.map((sentiment, index) => {
        const Icon = sentiment.icon;
        return (
          <motion.div
            key={sentiment.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={cn(
              "rounded-xl p-4 transition-all",
              sentiment.bgClass
            )}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Icon className={cn("w-3.5 h-3.5", sentiment.iconClass)} />
              <span className={cn("text-xs font-medium", sentiment.textClass)}>
                {sentiment.label}
              </span>
            </div>
            <div className="text-2xl font-semibold text-foreground">
              {sentiment.value}%
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SentimentDistribution;
