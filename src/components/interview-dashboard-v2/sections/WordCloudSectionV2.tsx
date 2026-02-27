import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Circle } from "lucide-react";

interface WordCloudItemInput {
  word?: string;
  text?: string;
  weight?: number;
  value?: number;
}

interface WordCloudSectionV2Props {
  data: WordCloudItemInput[];
}

type ViewMode = "treemap" | "bubble";

const PALETTE = [
  "hsl(var(--primary))",
  "hsl(var(--interu-purple))",
  "hsl(var(--accent))",
  "hsl(var(--interu-mint))",
  "hsl(var(--destructive))",
];

const getBgPalette = (i: number) => {
  const bases = [
    "hsl(var(--primary) / VAR)",
    "hsl(var(--interu-purple) / VAR)",
    "hsl(var(--accent) / VAR)",
    "hsl(var(--interu-mint) / VAR)",
    "hsl(var(--destructive) / VAR)",
  ];
  return bases[i % bases.length];
};

export const WordCloudSectionV2 = ({ data }: WordCloudSectionV2Props) => {
  const [view, setView] = useState<ViewMode>("treemap");

  const normalizedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    const items = data
      .map((item) => ({
        word: item.word ?? item.text ?? "",
        weight: item.weight ?? item.value ?? 1,
      }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 24);

    const maxW = Math.max(...items.map((i) => i.weight));
    return items.map((item) => ({ ...item, ratio: item.weight / maxW }));
  }, [data]);

  if (normalizedData.length === 0) return null;

  return (
    <section className="py-10">
      {/* Header with toggle */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--interu-purple) / 0.1)" }}>
            <LayoutGrid className="w-4 h-4" style={{ color: "hsl(var(--interu-purple))" }} />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Key Topics</h2>
        </div>

        {/* Toggle */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted/60">
          {([
            { key: "treemap" as const, label: "Treemap", Icon: LayoutGrid },
            { key: "bubble" as const, label: "Bubbles", Icon: Circle },
          ]).map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
              style={{ color: view === key ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))" }}
            >
              {view === key && (
                <motion.div
                  layoutId="wc-toggle"
                  className="absolute inset-0 rounded-lg bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">{label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="rounded-2xl bg-card border border-border/40 p-5 sm:p-6 overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
        <AnimatePresence mode="wait">
          {view === "treemap" ? (
            <TreemapView key="treemap" data={normalizedData} />
          ) : (
            <BubbleView key="bubble" data={normalizedData} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

/* ── Treemap View ── */
interface NormalizedItem {
  word: string;
  weight: number;
  ratio: number;
}

const TreemapView = ({ data }: { data: NormalizedItem[] }) => {
  const totalWeight = data.reduce((s, d) => s + d.weight, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid gap-1.5"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
        gridAutoRows: "minmax(50px, auto)",
      }}
    >
      {data.map((item, i) => {
        const pct = totalWeight > 0 ? item.weight / totalWeight : 0;
        // Large items span more columns
        const span = pct > 0.15 ? 3 : pct > 0.08 ? 2 : 1;
        const rowSpan = pct > 0.12 ? 2 : 1;
        const bgColor = getBgPalette(i).replace("VAR", `${0.10 + item.ratio * 0.12}`);
        const textColor = PALETTE[i % PALETTE.length];

        return (
          <motion.div
            key={item.word}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: i * 0.03 }}
            whileHover={{ scale: 1.03 }}
            className="rounded-xl flex items-center justify-center p-3 cursor-default transition-shadow hover:shadow-md"
            style={{
              gridColumn: `span ${span}`,
              gridRow: `span ${rowSpan}`,
              backgroundColor: bgColor,
              minHeight: rowSpan > 1 ? 100 : 50,
            }}
          >
            <span
              className="font-bold text-center leading-tight"
              style={{
                fontSize: `${0.75 + item.ratio * 0.9}rem`,
                color: textColor,
              }}
            >
              {item.word}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

/* ── Bubble View ── */
const BubbleView = ({ data }: { data: NormalizedItem[] }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="flex flex-wrap items-center justify-center gap-3 py-4"
  >
    {data.map((item, i) => {
      const size = 56 + item.ratio * 72;
      const bgColor = getBgPalette(i).replace("VAR", `${0.12 + item.ratio * 0.10}`);
      const textColor = PALETTE[i % PALETTE.length];

      return (
        <motion.div
          key={item.word}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.04, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          className="rounded-full flex items-center justify-center cursor-default transition-shadow hover:shadow-lg"
          style={{
            width: size,
            height: size,
            backgroundColor: bgColor,
            border: `1.5px solid ${PALETTE[i % PALETTE.length]}20`,
          }}
        >
          <span
            className="font-semibold text-center leading-none px-1"
            style={{
              fontSize: `${Math.max(0.6, 0.55 + item.ratio * 0.5)}rem`,
              color: textColor,
            }}
          >
            {item.word}
          </span>
        </motion.div>
      );
    })}
  </motion.div>
);

export default WordCloudSectionV2;
