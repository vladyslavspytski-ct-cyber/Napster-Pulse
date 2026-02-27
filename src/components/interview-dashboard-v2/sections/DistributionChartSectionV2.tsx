import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

interface DistributionChartInput {
  title?: string;
  labels: string[];
  values: number[];
}

interface DistributionChartSectionV2Props {
  data: DistributionChartInput;
}

const SEGMENT_COLORS = [
  { bg: "hsl(var(--primary))", muted: "hsl(var(--primary) / 0.10)", text: "hsl(var(--primary))" },
  { bg: "hsl(var(--interu-purple))", muted: "hsl(var(--interu-purple) / 0.10)", text: "hsl(var(--interu-purple))" },
  { bg: "hsl(var(--accent))", muted: "hsl(var(--accent) / 0.10)", text: "hsl(var(--accent))" },
  { bg: "hsl(var(--interu-mint))", muted: "hsl(var(--interu-mint) / 0.10)", text: "hsl(var(--interu-mint))" },
  { bg: "hsl(var(--destructive))", muted: "hsl(var(--destructive) / 0.08)", text: "hsl(var(--destructive))" },
];

const getColor = (i: number) => SEGMENT_COLORS[i % SEGMENT_COLORS.length];

export const DistributionChartSectionV2 = ({ data }: DistributionChartSectionV2Props) => {
  const total = useMemo(() => data?.values?.reduce((a, b) => a + b, 0) ?? 0, [data]);
  const dominant = useMemo(() => data?.values ? data.values.indexOf(Math.max(...data.values)) : 0, [data]);

  const segments = useMemo(() => {
    if (!data?.labels || !data?.values) return [];
    return data.labels.map((label, i) => ({
      label,
      value: data.values[i],
      pct: total > 0 ? (data.values[i] / total) * 100 : 0,
      color: getColor(i),
      isDominant: i === dominant,
    }));
  }, [data, total, dominant]);

  if (!data || !data.labels || !data.values || data.labels.length === 0 || data.values.length === 0) return null;

  return (
    <section className="py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 mb-6"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.1)" }}>
          <BarChart3 className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          {data.title ?? "Distribution"}
        </h2>
      </motion.div>

      <div className="rounded-2xl bg-card border border-border/40 p-5 sm:p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
        {/* Horizontal stacked bar */}
        <div className="relative h-10 rounded-xl overflow-hidden flex mb-6" style={{ gap: 2 }}>
          {segments.map((seg, i) => {
            if (seg.pct === 0) return null;
            return (
              <motion.div
                key={seg.label}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                className="relative rounded-lg flex items-center justify-center overflow-hidden"
                style={{
                  width: `${Math.max(seg.pct, 4)}%`,
                  backgroundColor: seg.color.bg,
                  transformOrigin: "left",
                }}
              >
                {seg.pct > 14 && (
                  <span className="text-[11px] font-semibold text-white/90 truncate px-1">
                    {Math.round(seg.pct)}%
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Segment cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {segments.map((seg, i) => (
            <motion.div
              key={seg.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="rounded-xl p-3.5 cursor-default transition-shadow"
              style={{
                backgroundColor: seg.color.muted,
                border: seg.isDominant ? `1.5px solid ${seg.color.bg}` : "1.5px solid transparent",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color.bg }} />
                <span className="text-xs text-muted-foreground truncate">{seg.label}</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold" style={{ color: seg.color.text }}>
                  {seg.value}
                </span>
                <span className="text-xs font-medium" style={{ color: seg.color.text, opacity: 0.7 }}>
                  {Math.round(seg.pct)}%
                </span>
              </div>
              {/* Mini bar */}
              <div className="h-1 rounded-full mt-2 overflow-hidden" style={{ backgroundColor: seg.color.muted }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: seg.color.bg }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${seg.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.4 + i * 0.08 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DistributionChartSectionV2;
