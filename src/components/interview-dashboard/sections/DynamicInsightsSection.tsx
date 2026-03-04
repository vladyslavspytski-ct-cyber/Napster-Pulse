import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const pop = (delay = 0) => ({
  initial: { opacity: 0, y: 24, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

// Backend can send either a single object or an array
interface DynamicInsightItem {
  title: string;
  content: string;
  type?: string;
}

interface DynamicInsightsSectionProps {
  data: DynamicInsightItem | DynamicInsightItem[];
}

export const DynamicInsightsSection = ({ data }: DynamicInsightsSectionProps) => {
  if (!data) return null;

  // Normalize to array - handle both single object and array
  const insights = Array.isArray(data) ? data : [data];

  if (insights.length === 0) return null;

  return (
    <section className="section-container max-w-6xl mx-auto py-16">
      <motion.div {...pop(0)} className="flex items-center gap-2 mb-8">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">AI Insights</h2>
      </motion.div>
      <div className="space-y-4">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            {...pop(0.08 * i)}
            className="p-6 rounded-2xl bg-gradient-to-br from-primary/[0.03] to-background border border-border/40"
          >
            {insight.title && (
              <h3 className="text-base font-semibold text-foreground mb-3">{insight.title}</h3>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {insight.content}
            </p>
            {insight.type && (
              <span className="inline-block mt-4 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/8 text-primary">
                {insight.type}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default DynamicInsightsSection;
