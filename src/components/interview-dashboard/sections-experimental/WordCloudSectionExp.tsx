import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Circle } from "lucide-react";
import { Treemap, ResponsiveContainer } from "recharts";

// Backend can send either { word, weight } or { text, value }
interface WordCloudItemInput {
  word?: string;
  text?: string;
  weight?: number;
  value?: number;
}

interface WordCloudSectionExpProps {
  data: WordCloudItemInput[];
}

type ViewMode = "treemap" | "bubble";

// Color palette
const COLORS = [
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#f59e0b", // amber
  "#f43f5e", // rose
  "#6366f1", // indigo
  "#d946ef", // fuchsia
  "#84cc16", // lime
  "#ec4899", // pink
  "#14b8a6", // teal
];

export const WordCloudSectionExp = ({ data }: WordCloudSectionExpProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("treemap");

  // Normalize data - filter out items with 0 or negative values
  const normalizedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    return data
      .map((item) => ({
        name: item.word ?? item.text ?? "",
        size: item.weight ?? item.value ?? 0,
      }))
      .filter((item) => item.size > 0) // Filter out 0 values
      .sort((a, b) => b.size - a.size)
      .slice(0, 20)
      .map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length], // Assign colors after filtering
      }));
  }, [data]);

  if (normalizedData.length === 0) return null;

  const maxWeight = Math.max(...normalizedData.map((t) => t.size));

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-interu-purple/[0.03] via-transparent to-primary/[0.02]" />

      <div className="section-container max-w-7xl mx-auto relative z-10">
        {/* Header with toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-foreground">Key Topics</h2>
            <p className="text-sm text-muted-foreground mt-1">What participants mentioned most</p>
          </motion.div>

          {/* View mode toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex gap-1 p-1 rounded-xl bg-muted/60 backdrop-blur-sm"
          >
            <button
              onClick={() => setViewMode("treemap")}
              className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                viewMode === "treemap" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {viewMode === "treemap" && (
                <motion.div
                  layoutId="wordcloud-tab"
                  className="absolute inset-0 rounded-lg bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <LayoutGrid className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Treemap</span>
            </button>
            <button
              onClick={() => setViewMode("bubble")}
              className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                viewMode === "bubble" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {viewMode === "bubble" && (
                <motion.div
                  layoutId="wordcloud-tab"
                  className="absolute inset-0 rounded-lg bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Circle className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Bubble</span>
            </button>
          </motion.div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {viewMode === "treemap" ? (
            <TreemapView key="treemap" data={normalizedData} />
          ) : (
            <BubbleView key="bubble" data={normalizedData} maxWeight={maxWeight} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// Custom content for Treemap cells
interface CustomTreemapContentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  color: string;
  size: number;
}

const CustomTreemapContent = ({ x, y, width, height, name, color, size }: CustomTreemapContentProps) => {
  // Calculate font size based on cell size - smaller sizes
  const area = width * height;
  let fontSize = 8;
  if (area > 20000) fontSize = 14;
  else if (area > 12000) fontSize = 12;
  else if (area > 6000) fontSize = 10;
  else if (area > 3000) fontSize = 9;
  else fontSize = 8;

  // Don't render text if cell is too small
  const showText = width > 25 && height > 18;
  const showWeight = width > 45 && height > 30;

  // Calculate max characters per line based on width and font size
  const charsPerLine = Math.floor((width - 8) / (fontSize * 0.6));

  // Split name into lines if needed
  const getLines = (text: string, maxChars: number): string[] => {
    if (text.length <= maxChars) return [text];

    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      if (currentLine.length + word.length + 1 <= maxChars) {
        currentLine = currentLine ? `${currentLine} ${word}` : word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word.length > maxChars ? word.slice(0, maxChars - 1) + "…" : word;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Limit to 2 lines max
    if (lines.length > 2) {
      return [lines[0], lines[1].slice(0, -1) + "…"];
    }
    return lines;
  };

  const lines = showText ? getLines(name, charsPerLine) : [];
  const lineHeight = fontSize * 1.2;
  const totalTextHeight = lines.length * lineHeight + (showWeight ? fontSize : 0);
  const startY = y + height / 2 - totalTextHeight / 2 + fontSize / 2;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={1}
        style={{ transition: "all 0.2s ease" }}
      />
      {showText && lines.map((line, i) => (
        <text
          key={i}
          x={x + width / 2}
          y={startY + i * lineHeight}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={fontSize}
          fontWeight="600"
          style={{ pointerEvents: "none" }}
        >
          {line}
        </text>
      ))}
      {showWeight && (
        <text
          x={x + width / 2}
          y={startY + lines.length * lineHeight}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.6)"
          fontSize={fontSize - 2}
          fontWeight="500"
          style={{ pointerEvents: "none" }}
        >
          {size}
        </text>
      )}
    </g>
  );
};

// Treemap View using Recharts
interface TreemapViewProps {
  data: { name: string; size: number; color: string }[];
}

const TreemapView = ({ data }: TreemapViewProps) => {
  const treemapData = [{ name: "root", children: data }];

  return (
    <div className="h-[350px] md:h-[400px] rounded-2xl overflow-hidden bg-muted/30 border border-border/40">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={treemapData}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="transparent"
          fill="transparent"
          content={<CustomTreemapContent x={0} y={0} width={0} height={0} name="" color="" size={0} />}
        />
      </ResponsiveContainer>
    </div>
  );
};

// Bubble View with circle packing
interface BubbleViewProps {
  data: { name: string; size: number; color: string }[];
  maxWeight: number;
}

// Circle packing algorithm
const packCircles = (
  data: { name: string; size: number; color: string }[],
  containerWidth: number,
  containerHeight: number,
  maxWeight: number
) => {
  const minRadius = 25;
  const maxRadius = 55;

  const circles = data.map((item) => {
    const ratio = item.size / maxWeight;
    const r = minRadius + ratio * (maxRadius - minRadius);
    return { ...item, r, x: 0, y: 0 };
  });

  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  // Place circles using spiral packing
  circles.forEach((circle, i) => {
    if (i === 0) {
      circle.x = centerX;
      circle.y = centerY;
      return;
    }

    let placed = false;
    for (let attempt = 0; attempt < 1000 && !placed; attempt++) {
      const angle = attempt * 0.2;
      const distance = 10 + attempt * 1.5;
      const testX = centerX + Math.cos(angle) * distance;
      const testY = centerY + Math.sin(angle) * distance;

      // Check bounds
      if (
        testX - circle.r < 5 ||
        testX + circle.r > containerWidth - 5 ||
        testY - circle.r < 5 ||
        testY + circle.r > containerHeight - 5
      ) {
        continue;
      }

      // Check overlap
      let overlaps = false;
      for (let j = 0; j < i; j++) {
        const dx = testX - circles[j].x;
        const dy = testY - circles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < circle.r + circles[j].r + 4) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        circle.x = testX;
        circle.y = testY;
        placed = true;
      }
    }
  });

  return circles;
};

const BubbleView = ({ data, maxWeight }: BubbleViewProps) => {
  const containerWidth = 800;
  const containerHeight = 380;

  const circles = useMemo(
    () => packCircles(data, containerWidth, containerHeight, maxWeight),
    [data, maxWeight]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[350px] md:h-[400px] rounded-2xl bg-gradient-to-br from-card/50 to-card/30 border border-border/40 overflow-hidden"
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${containerWidth} ${containerHeight}`} preserveAspectRatio="xMidYMid meet">
        {circles.map((circle, i) => {
          const fontSize = circle.r > 40 ? 12 : circle.r > 30 ? 10 : 8;
          const showWeight = circle.r > 30;

          return (
            <motion.g
              key={circle.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, duration: 0.4, type: "spring" }}
            >
              <circle
                cx={circle.x}
                cy={circle.y}
                r={circle.r}
                fill={circle.color}
                opacity={0.9}
                style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
              />
              <text
                x={circle.x}
                y={circle.y - (showWeight ? 5 : 0)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={fontSize}
                fontWeight="600"
              >
                {circle.name.length > circle.r / 5
                  ? circle.name.slice(0, Math.floor(circle.r / 5)) + "…"
                  : circle.name}
              </text>
              {showWeight && (
                <text
                  x={circle.x}
                  y={circle.y + fontSize}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.7)"
                  fontSize={fontSize - 2}
                  fontWeight="500"
                >
                  {circle.size}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>
    </motion.div>
  );
};

export default WordCloudSectionExp;
