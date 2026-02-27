import { motion } from "framer-motion";
import { Radar } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const pop = (delay = 0) => ({
  initial: { opacity: 0, y: 24, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

const CustomTooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "12px",
  boxShadow: "0 8px 24px -4px hsl(220 20% 10% / 0.12)",
};

// Backend sends { labels: string[], values: number[] }
// or could send array [{ skill, average, benchmark? }]
interface SkillsRadarObjectInput {
  labels: string[];
  values: number[];
}

interface SkillRadarArrayItem {
  skill: string;
  average: number;
  benchmark?: number;
}

interface SkillsRadarSectionProps {
  data: SkillsRadarObjectInput | SkillRadarArrayItem[];
}

export const SkillsRadarSection = ({ data }: SkillsRadarSectionProps) => {
  if (!data) return null;

  // Normalize data - handle both object { labels, values } and array formats
  let chartData: { skill: string; average: number; benchmark: number }[];

  if (Array.isArray(data)) {
    // Array format: [{ skill, average, benchmark? }]
    if (data.length === 0) return null;
    chartData = data.map((item) => ({
      skill: item.skill,
      average: item.average,
      benchmark: item.benchmark ?? 0,
    }));
  } else if (data.labels && data.values) {
    // Object format: { labels: [...], values: [...] }
    if (data.labels.length === 0) return null;
    chartData = data.labels.map((label, i) => ({
      skill: label,
      average: data.values[i] ?? 0,
      benchmark: 0,
    }));
  } else {
    return null;
  }

  return (
    <section className="section-container max-w-6xl mx-auto py-16">
      <motion.div {...pop(0)} className="flex items-center gap-2 mb-8">
        <Radar className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Comparative Analysis</h2>
      </motion.div>
      <motion.div
        {...pop(0.1)}
        className="p-6 rounded-2xl bg-card border border-border/40 max-w-2xl mx-auto"
      >
        <ResponsiveContainer width="100%" height={360}>
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <PolarRadiusAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} domain={[0, 10]} />
            <RechartsRadar
              name="Average"
              dataKey="average"
              stroke="hsl(220 70% 55%)"
              fill="hsl(220 70% 55%)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            {chartData.some((d) => d.benchmark > 0) && (
              <RechartsRadar
                name="Benchmark"
                dataKey="benchmark"
                stroke="hsl(260 60% 60%)"
                fill="hsl(260 60% 60%)"
                fillOpacity={0.1}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
            )}
            <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
            <Tooltip contentStyle={CustomTooltipStyle} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </section>
  );
};

export default SkillsRadarSection;
