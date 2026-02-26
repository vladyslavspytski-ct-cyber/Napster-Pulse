import { useEffect } from "react";
import { PieChart } from "lucide-react";

// Backend sends { title, labels, values }
interface DistributionChartInput {
  title?: string;
  labels: string[];
  values: number[];
}

interface DistributionChartSectionProps {
  data: DistributionChartInput;
}

/**
 * Placeholder component for distribution_chart section.
 * UI will be implemented later in Lovable.
 */
export const DistributionChartSection = ({ data }: DistributionChartSectionProps) => {
  // Log data for debugging
  useEffect(() => {
    if (data) {
      console.log("[DistributionChartSection] title:", data.title);
      console.log("[DistributionChartSection] labels:", data.labels);
      console.log("[DistributionChartSection] values:", data.values);
    }
  }, [data]);

  if (!data || !data.labels || !data.values) return null;
  if (data.labels.length === 0 || data.values.length === 0) return null;

  return (
    <section className="section-container max-w-6xl mx-auto py-16">
      <div className="flex items-center gap-2 mb-4">
        <PieChart className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">
          {data.title ?? "Distribution Chart"}
        </h2>
      </div>
      <div className="p-6 rounded-2xl bg-card border border-border/40 text-center text-muted-foreground">
        <p className="text-sm">Chart placeholder - UI will be implemented in Lovable</p>
        <p className="text-xs mt-2">
          {data.labels.length} categories, {data.values.reduce((a, b) => a + b, 0)} total
        </p>
      </div>
    </section>
  );
};

export default DistributionChartSection;
