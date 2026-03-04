import { motion } from "framer-motion";
import { Target } from "lucide-react";

const pop = (delay = 0) => ({
  initial: { opacity: 0, y: 24, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

// Backend sends { criterion, avg_score, max_score, min_score }
// or could send { criteria, score, max?, percentile? }
interface CriteriaBenchmarkInput {
  criterion?: string;
  criteria?: string;
  avg_score?: number;
  score?: number;
  max_score?: number;
  min_score?: number;
  max?: number;
  percentile?: number;
}

interface CriteriaBenchmarksSectionProps {
  data: CriteriaBenchmarkInput[];
}

export const CriteriaBenchmarksSection = ({ data }: CriteriaBenchmarksSectionProps) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  // Normalize: support both backend formats
  const benchmarks = data.map((b) => ({
    criteria: b.criterion ?? b.criteria ?? "",
    score: b.avg_score ?? b.score ?? 0,
    maxScore: b.max_score ?? b.max ?? 10,
    minScore: b.min_score ?? 0,
    percentile: b.percentile,
  }));

  return (
    <section className="section-container max-w-6xl mx-auto py-16">
      <motion.div {...pop(0)} className="flex items-center gap-2 mb-8">
        <Target className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Criteria Benchmarks</h2>
      </motion.div>
      <div className="space-y-4">
        {benchmarks.map((b, i) => {
          // Calculate percentage based on max score (default 10)
          const percentage = (b.score / b.maxScore) * 100;
          return (
            <motion.div
              key={`${b.criteria}-${i}`}
              {...pop(0.05 * i)}
              className="p-4 rounded-xl bg-card border border-border/40 space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-foreground">{b.criteria}</span>
                <span className="text-sm font-bold text-primary tabular-nums">
                  {b.score.toFixed(1)} / {b.maxScore}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--interu-purple)))`,
                  }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.06 }}
                />
              </div>
              {b.minScore !== undefined && b.maxScore !== undefined && (
                <p className="text-xs text-muted-foreground">
                  Range: {b.minScore} - {b.maxScore}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default CriteriaBenchmarksSection;
