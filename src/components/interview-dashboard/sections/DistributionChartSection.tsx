import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart } from "lucide-react";

interface DistributionChartInput {
  title?: string;
  labels: string[];
  values: number[];
}

interface DistributionChartSectionProps {
  data: DistributionChartInput;
}

/* ── Color palette from design tokens (HSL) ── */
const SEGMENT_COLORS = [
  { bg: "hsl(160 50% 50%)", bgMuted: "hsl(160 50% 50% / 0.12)", text: "hsl(160 50% 35%)", ring: "hsl(160 50% 50% / 0.3)" },
  { bg: "hsl(220 70% 55%)", bgMuted: "hsl(220 70% 55% / 0.12)", text: "hsl(220 70% 45%)", ring: "hsl(220 70% 55% / 0.3)" },
  { bg: "hsl(220 10% 60%)", bgMuted: "hsl(220 10% 60% / 0.10)", text: "hsl(220 10% 45%)", ring: "hsl(220 10% 60% / 0.2)" },
  { bg: "hsl(0 84% 60%)",  bgMuted: "hsl(0 84% 60% / 0.10)",  text: "hsl(0 84% 45%)",  ring: "hsl(0 84% 60% / 0.2)" },
  { bg: "hsl(260 60% 60%)", bgMuted: "hsl(260 60% 60% / 0.12)", text: "hsl(260 60% 45%)", ring: "hsl(260 60% 60% / 0.3)" },
  { bg: "hsl(15 85% 60%)",  bgMuted: "hsl(15 85% 60% / 0.12)",  text: "hsl(15 85% 45%)",  ring: "hsl(15 85% 60% / 0.3)" },
];

const getColor = (i: number) => SEGMENT_COLORS[i % SEGMENT_COLORS.length];

type ConceptKey = "A" | "B" | "C";

/* ════════════════════════════════════════════════
   CONCEPT A — Proportional Blocks
   Horizontal stacked segments with KPI callouts
   ════════════════════════════════════════════════ */
const ConceptA = ({ data }: { data: DistributionChartInput }) => {
  const total = data.values.reduce((a, b) => a + b, 0);
  const dominant = data.values.indexOf(Math.max(...data.values));

  return (
    <div className="space-y-6">
      {/* Stacked bar */}
      <div className="relative h-14 rounded-2xl overflow-hidden flex" style={{ gap: 3 }}>
        {data.labels.map((label, i) => {
          const pct = total > 0 ? (data.values[i] / total) * 100 : 0;
          if (pct === 0) return null;
          const color = getColor(i);
          return (
            <motion.div
              key={label}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              style={{
                width: `${pct}%`,
                backgroundColor: color.bg,
                transformOrigin: "left",
              }}
              className="relative rounded-xl flex items-center justify-center overflow-hidden"
            >
              {pct > 12 && (
                <span className="text-xs font-semibold text-white/90 truncate px-2">
                  {Math.round(pct)}%
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {data.labels.map((label, i) => {
          const pct = total > 0 ? (data.values[i] / total) * 100 : 0;
          const color = getColor(i);
          const isDominant = i === dominant;
          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
              className="relative rounded-2xl p-4 border transition-all"
              style={{
                backgroundColor: color.bgMuted,
                borderColor: isDominant ? color.bg : "transparent",
                boxShadow: isDominant ? `0 0 20px ${color.ring}` : undefined,
              }}
            >
              {isDominant && (
                <span className="absolute top-2 right-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: color.bg }}>
                  Top
                </span>
              )}
              <div className="text-2xl font-bold" style={{ color: color.text }}>
                {data.values[i]}
              </div>
              <div className="text-xs text-muted-foreground mt-1 leading-tight">{label}</div>
              <div className="text-[11px] font-medium mt-1" style={{ color: color.bg }}>
                {Math.round(pct)}%
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════
   CONCEPT B — Radial Arcs
   Concentric arc rings emanating from center
   ════════════════════════════════════════════════ */
const ConceptB = ({ data }: { data: DistributionChartInput }) => {
  const total = data.values.reduce((a, b) => a + b, 0);
  const maxVal = Math.max(...data.values);
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      {/* Radial arcs */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
          {data.labels.map((label, i) => {
            const pct = maxVal > 0 ? data.values[i] / maxVal : 0;
            const ringWidth = 14;
            const gap = 6;
            const r = (size / 2) - 20 - i * (ringWidth + gap);
            const circumference = 2 * Math.PI * r;
            const color = getColor(i);
            return (
              <g key={label}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={ringWidth} opacity={0.3} />
                <motion.circle
                  cx={cx} cy={cy} r={r}
                  fill="none"
                  stroke={color.bg}
                  strokeWidth={ringWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference * (1 - pct) }}
                  transition={{ duration: 0.9, delay: i * 0.12, ease: "easeOut" }}
                  style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                />
              </g>
            );
          })}
        </svg>
        {/* Center total */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold text-foreground"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {total}
          </motion.span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-3 w-full">
        {data.labels.map((label, i) => {
          const pct = total > 0 ? (data.values[i] / total) * 100 : 0;
          const color = getColor(i);
          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color.bg }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-foreground truncate">{label}</span>
                  <span className="text-sm font-bold tabular-nums" style={{ color: color.text }}>
                    {data.values[i]}
                  </span>
                </div>
                {/* Mini bar */}
                <div className="h-1.5 rounded-full mt-1.5 overflow-hidden" style={{ backgroundColor: color.bgMuted }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color.bg }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.08 }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════
   CONCEPT C — Donut + Hero KPI
   Single donut ring with dominant segment hero
   ════════════════════════════════════════════════ */
const ConceptC = ({ data }: { data: DistributionChartInput }) => {
  const total = data.values.reduce((a, b) => a + b, 0);
  const dominant = data.values.indexOf(Math.max(...data.values));
  const dominantPct = total > 0 ? Math.round((data.values[dominant] / total) * 100) : 0;

  // Build donut segments
  const segments = useMemo(() => {
    let cumAngle = -90; // start at top
    return data.labels.map((label, i) => {
      const pct = total > 0 ? data.values[i] / total : 0;
      const angle = pct * 360;
      const start = cumAngle;
      cumAngle += angle;
      return { label, value: data.values[i], pct, startAngle: start, angle, color: getColor(i) };
    });
  }, [data, total]);

  const r = 80;
  const cx = 110;
  const cy = 110;

  const describeArc = (startAngle: number, endAngle: number) => {
    const rad = (a: number) => (a * Math.PI) / 180;
    const x1 = cx + r * Math.cos(rad(startAngle));
    const y1 = cy + r * Math.sin(rad(startAngle));
    const x2 = cx + r * Math.cos(rad(endAngle));
    const y2 = cy + r * Math.sin(rad(endAngle));
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      {/* Donut */}
      <div className="relative shrink-0" style={{ width: 220, height: 220 }}>
        <svg viewBox="0 0 220 220" className="w-full h-full">
          {segments.map((seg, i) => {
            if (seg.pct === 0) return null;
            // For 100% segments, draw a full circle
            if (seg.pct >= 0.999) {
              return (
                <motion.circle
                  key={seg.label}
                  cx={cx} cy={cy} r={r}
                  fill="none"
                  stroke={seg.color.bg}
                  strokeWidth={i === dominant ? 24 : 18}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8 }}
                />
              );
            }
            return (
              <motion.path
                key={seg.label}
                d={describeArc(seg.startAngle, seg.startAngle + seg.angle)}
                fill="none"
                stroke={seg.color.bg}
                strokeWidth={i === dominant ? 24 : 18}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              />
            );
          })}
        </svg>
        {/* Center hero */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold"
            style={{ color: getColor(dominant).text }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
          >
            {dominantPct}%
          </motion.span>
          <span className="text-[11px] text-muted-foreground font-medium mt-0.5">
            {data.labels[dominant]}
          </span>
        </div>
      </div>

      {/* Stat pills */}
      <div className="flex-1 grid grid-cols-2 gap-3 w-full">
        {data.labels.map((label, i) => {
          const pct = total > 0 ? Math.round((data.values[i] / total) * 100) : 0;
          const color = getColor(i);
          const isDominant = i === dominant;
          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.4 + i * 0.07 }}
              className="rounded-xl p-3.5 border"
              style={{
                backgroundColor: color.bgMuted,
                borderColor: isDominant ? color.bg : "transparent",
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.bg }} />
                <span className="text-xs text-muted-foreground truncate">{label}</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold" style={{ color: color.text }}>{data.values[i]}</span>
                <span className="text-xs" style={{ color: color.bg }}>{pct}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════
   Main Section — with concept switcher
   ════════════════════════════════════════════════ */
const concepts: { key: ConceptKey; label: string }[] = [
  { key: "A", label: "Blocks" },
  { key: "B", label: "Arcs" },
  { key: "C", label: "Donut" },
];

export const DistributionChartSection = ({ data }: DistributionChartSectionProps) => {
  const [active, setActive] = useState<ConceptKey>("A");

  if (!data || !data.labels || !data.values) return null;
  if (data.labels.length === 0 || data.values.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.1)" }}>
            <PieChart className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            {data.title ?? "Distribution Chart"}
          </h2>
        </div>

        {/* Concept switcher */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted/60">
          {concepts.map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className="relative px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
              style={{ color: active === c.key ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))" }}
            >
              {active === c.key && (
                <motion.div
                  layoutId="dist-tab"
                  className="absolute inset-0 rounded-lg bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/40" style={{ boxShadow: "var(--shadow-sm)" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {active === "A" && <ConceptA data={data} />}
            {active === "B" && <ConceptB data={data} />}
            {active === "C" && <ConceptC data={data} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DistributionChartSection;
