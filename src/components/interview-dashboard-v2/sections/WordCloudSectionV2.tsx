import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Circle } from "lucide-react";
import {
  forceSimulation,
  forceCollide,
  forceCenter,
  forceManyBody,
  forceX,
  forceY,
  type SimulationNodeDatum,
} from "d3-force";

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
  const bases = ["--primary", "--interu-purple", "--accent", "--interu-mint", "--destructive"];
  return `hsl(var(${bases[i % bases.length]}) / ${opacity})`;
};

interface NormalizedItem {
  word: string;
  weight: number;
  ratio: number;
}

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
  x: number, y: number, w: number, h: number
): TreemapRect[] {
  if (items.length === 0) return [];
  if (items.length === 1) return [{ x, y, w, h, item: items[0].item, index: items[0].index }];

  const rects: TreemapRect[] = [];
  let remaining = [...items];
  let cx = x, cy = y, cw = w, ch = h;

  while (remaining.length > 0) {
    const isWide = cw >= ch;
    const side = isWide ? ch : cw;
    const remainingTotal = remaining.reduce((s, i) => s + i.weight, 0);

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
      } else break;
    }

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

    if (isWide) { cx += rowSize; cw -= rowSize; }
    else { cy += rowSize; ch -= rowSize; }

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

  const gap = 5;

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
        const innerW = rect.w - gap;
        const innerH = rect.h - gap;
        const minDim = Math.min(innerW, innerH);
        const fontSize = Math.max(9, Math.min(16, minDim * 0.2, innerW / Math.max(rect.item.word.length * 0.7, 1)));

        return (
          <motion.div
            key={rect.item.word}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: i * 0.02 }}
            whileHover={{ scale: 1.03, zIndex: 20 }}
            className="absolute rounded-xl flex items-center justify-center cursor-default transition-shadow hover:shadow-md overflow-hidden"
            style={{
              left: rect.x + gap / 2,
              top: rect.y + gap / 2,
              width: innerW,
              height: innerH,
              backgroundColor: bgColor,
            }}
          >
            <span
              className="font-bold text-center leading-tight px-2 break-words overflow-hidden"
              style={{
                fontSize,
                color: textColor,
                maxWidth: "100%",
                maxHeight: "100%",
                wordBreak: "break-word",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
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

/* ── Bubble View — d3-force packed layout ── */

interface BubbleNode extends SimulationNodeDatum {
  word: string;
  radius: number;
  ratio: number;
  colorIndex: number;
}

const BubbleView = ({ data }: { data: NormalizedItem[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(500);
  const [nodes, setNodes] = useState<BubbleNode[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const containerHeight = useMemo(
    () => Math.max(300, Math.min(500, containerWidth * 0.65)),
    [containerWidth]
  );

  useEffect(() => {
    const minR = Math.max(14, containerWidth * 0.018);
    const maxR = Math.max(28, containerWidth * 0.042);

    const initialNodes: BubbleNode[] = data.map((item, i) => ({
      word: item.word,
      ratio: item.ratio,
      radius: minR + item.ratio * (maxR - minR),
      colorIndex: i,
      x: containerWidth / 2 + (Math.random() - 0.5) * 100,
      y: containerHeight / 2 + (Math.random() - 0.5) * 80,
    }));

    const sim = forceSimulation(initialNodes)
      .force("center", forceCenter(containerWidth / 2, containerHeight / 2))
      .force("charge", forceManyBody().strength(5))
      .force("collide", forceCollide<BubbleNode>().radius((d) => d.radius + 3).strength(1).iterations(4))
      .force("x", forceX(containerWidth / 2).strength(0.08))
      .force("y", forceY(containerHeight / 2).strength(0.08))
      .stop();

    // Run simulation synchronously
    for (let i = 0; i < 200; i++) sim.tick();

    setNodes([...initialNodes]);
  }, [data, containerWidth, containerHeight]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full"
      style={{ height: containerHeight }}
    >
      {nodes.map((node, i) => {
        const bgColor = getBgColor(node.colorIndex, 0.12 + node.ratio * 0.10);
        const textColor = PALETTE[node.colorIndex % PALETTE.length];
        const size = node.radius * 2;
        const fontSize = Math.max(9, Math.min(14, node.radius * 0.38, (node.radius * 1.4) / Math.max(node.word.length * 0.35, 1)));

        return (
          <motion.div
            key={node.word}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: (node.x ?? 0) - node.radius,
              y: (node.y ?? 0) - node.radius,
            }}
            transition={{
              duration: 0.6,
              delay: i * 0.03,
              type: "spring",
              stiffness: 180,
              damping: 18,
            }}
            whileHover={{ scale: 1.08 }}
            className="absolute rounded-full flex items-center justify-center cursor-default transition-shadow hover:shadow-lg"
            style={{
              width: size,
              height: size,
              backgroundColor: bgColor,
              border: `1.5px solid ${PALETTE[node.colorIndex % PALETTE.length]}20`,
            }}
          >
            <span
              className="font-semibold text-center leading-none px-1 overflow-hidden"
              style={{
                fontSize,
                color: textColor,
                maxWidth: "85%",
                wordBreak: "break-word",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {node.word}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default WordCloudSectionV2;
