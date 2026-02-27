import { useState, useMemo, useRef, useEffect } from "react";
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

const getBgColor = (i: number, opacity: number) => {
  const bases = [
    "--primary",
    "--interu-purple",
    "--accent",
    "--interu-mint",
    "--destructive",
  ];
  return `hsl(var(${bases[i % bases.length]}) / ${opacity})`;
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

/* ── Treemap View — Squarified algorithm ── */
interface NormalizedItem {
  word: string;
  weight: number;
  ratio: number;
}

interface TreemapRect {
  x: number;
  y: number;
  w: number;
  h: number;
  item: NormalizedItem;
  index: number;
}

function squarify(
  items: { weight: number; item: NormalizedItem; index: number }[],
  x: number,
  y: number,
  w: number,
  h: number
): TreemapRect[] {
  if (items.length === 0) return [];
  if (items.length === 1) {
    return [{ x, y, w, h, item: items[0].item, index: items[0].index }];
  }

  const total = items.reduce((s, i) => s + i.weight, 0);
  const rects: TreemapRect[] = [];

  let remaining = [...items];
  let cx = x, cy = y, cw = w, ch = h;

  while (remaining.length > 0) {
    const isWide = cw >= ch;
    const side = isWide ? ch : cw;
    const remainingTotal = remaining.reduce((s, i) => s + i.weight, 0);

    // Find the best row
    let row: typeof remaining = [];
    let bestRatio = Infinity;

    for (let i = 1; i <= remaining.length; i++) {
      const candidate = remaining.slice(0, i);
      const candidateTotal = candidate.reduce((s, it) => s + it.weight, 0);
      const rowSize = (candidateTotal / remainingTotal) * (isWide ? cw : ch);

      let worstRatio = 0;
      for (const it of candidate) {
        const itemSize = (it.weight / candidateTotal) * side;
        const r = Math.max(rowSize / itemSize, itemSize / rowSize);
        worstRatio = Math.max(worstRatio, r);
      }

      if (worstRatio <= bestRatio) {
        bestRatio = worstRatio;
        row = candidate;
      } else {
        break;
      }
    }

    // Layout the row
    const rowTotal = row.reduce((s, it) => s + it.weight, 0);
    const rowSize = (rowTotal / remainingTotal) * (isWide ? cw : ch);

    let offset = 0;
    for (const it of row) {
      const itemFraction = it.weight / rowTotal;
      const itemSize = itemFraction * side;

      if (isWide) {
        rects.push({ x: cx, y: cy + offset, w: rowSize, h: itemSize, item: it.item, index: it.index });
      } else {
        rects.push({ x: cx + offset, y: cy, w: itemSize, h: rowSize, item: it.item, index: it.index });
      }
      offset += itemSize;
    }

    // Update remaining area
    if (isWide) {
      cx += rowSize;
      cw -= rowSize;
    } else {
      cy += rowSize;
      ch -= rowSize;
    }

    remaining = remaining.slice(row.length);
  }

  return rects;
}

const TreemapView = ({ data }: { data: NormalizedItem[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 600, h: 350 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({
          w: entry.contentRect.width,
          h: Math.max(280, Math.min(420, entry.contentRect.width * 0.5)),
        });
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const rects = useMemo(() => {
    const items = data.map((item, index) => ({ weight: item.weight, item, index }));
    return squarify(items, 0, 0, containerSize.w, containerSize.h);
  }, [data, containerSize]);

  const gap = 3;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full"
      style={{ height: containerSize.h }}
    >
      {rects.map((rect, i) => {
        const bgColor = getBgColor(rect.index, 0.10 + rect.item.ratio * 0.12);
        const textColor = PALETTE[rect.index % PALETTE.length];
        // Scale font to fit: use shorter dimension
        const minDim = Math.min(rect.w - gap * 2, rect.h - gap * 2);
        const fontSize = Math.max(10, Math.min(18, minDim * 0.22, (rect.w - gap * 2) / Math.max(rect.item.word.length * 0.65, 1)));

        return (
          <motion.div
            key={rect.item.word}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: i * 0.02 }}
            whileHover={{ scale: 1.02, zIndex: 10 }}
            className="absolute rounded-xl flex items-center justify-center cursor-default transition-shadow hover:shadow-md overflow-hidden"
            style={{
              left: rect.x + gap / 2,
              top: rect.y + gap / 2,
              width: rect.w - gap,
              height: rect.h - gap,
              backgroundColor: bgColor,
            }}
          >
            <span
              className="font-bold text-center leading-tight px-2 break-words"
              style={{
                fontSize,
                color: textColor,
                maxWidth: "100%",
                wordBreak: "break-word",
              }}
            >
              {rect.item.word}
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
      const bgColor = getBgColor(i, 0.12 + item.ratio * 0.10);
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
