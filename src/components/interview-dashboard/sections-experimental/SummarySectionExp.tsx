import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Users, ChevronDown, ChevronUp, Zap } from "lucide-react";

interface SummaryDataInput {
  text: string;
  overall_score?: number;
  overall_status?: string;
}

interface SummarySectionExpProps {
  data: SummaryDataInput;
  title: string;
  completedCount: number;
}

// Parse markdown text into structured blocks (reused from original)
interface ContentBlock {
  type: "heading" | "paragraph" | "list";
  content: string;
  items?: string[];
}

function parseMarkdown(text: string): ContentBlock[] {
  const lines = text.split("\n");
  const blocks: ContentBlock[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({ type: "list", content: "", items: [...currentList] });
      currentList = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }

    const headingMatch = trimmed.match(/^#{2,3}\s+(.+)$/);
    if (headingMatch) {
      flushList();
      blocks.push({ type: "heading", content: headingMatch[1] });
      continue;
    }

    // eslint-disable-next-line no-useless-escape
    const listMatch = trimmed.match(/^[\*\-]\s+(.+)$/);
    if (listMatch) {
      currentList.push(listMatch[1]);
      continue;
    }

    flushList();
    blocks.push({ type: "paragraph", content: trimmed });
  }

  flushList();
  return blocks;
}

function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={key++} className="font-semibold text-foreground">
        {match[1]}
      </strong>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

export const SummarySectionExp = ({ data, title, completedCount }: SummarySectionExpProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const blocks = useMemo(() => parseMarkdown(data.text || ""), [data.text]);
  const headingCount = blocks.filter((b) => b.type === "heading").length;
  const isLongContent = headingCount > 2 || blocks.length > 8;

  const visibleBlocks = useMemo(() => {
    if (isExpanded || !isLongContent) return blocks;

    const result: ContentBlock[] = [];
    let foundFirstHeading = false;

    for (const block of blocks) {
      if (block.type === "heading") {
        if (foundFirstHeading) break;
        foundFirstHeading = true;
      }
      result.push(block);
    }

    return result.length > 0 ? result : blocks.slice(0, 3);
  }, [blocks, isExpanded, isLongContent]);

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Dynamic gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-background to-interu-purple/[0.06]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-interu-purple/[0.06] blur-[100px]" />
        <div className="absolute top-1/3 left-0 w-[400px] h-[300px] rounded-full bg-accent/[0.04] blur-[80px]" />
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />

      <div className="px-4 sm:px-6 relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 mb-12"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-interu-purple/15 border border-primary/20 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-interu-purple bg-clip-text text-transparent">
              AI-Powered Insight Canvas
            </span>
            <Zap className="w-3.5 h-3.5 text-interu-purple" />
          </motion.div>

          {/* Title with gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
          >
            <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h1>

          {/* Meta info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 border border-border/40 text-sm text-muted-foreground">
              <Users className="w-4 h-4" /> {completedCount} participants
            </span>
            {data.overall_status && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary">
                {data.overall_status}
              </span>
            )}
          </motion.div>
        </motion.div>

        {/* Giant score */}
        {data.overall_score !== undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            className="text-center mb-16"
          >
            <div className="relative inline-block">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-interu-purple blur-3xl opacity-20 scale-150" />

              <div className="relative flex items-baseline justify-center gap-2">
                <span className="text-9xl md:text-[10rem] font-black tracking-tighter bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent leading-none">
                  {data.overall_score}
                </span>
                <span className="text-3xl md:text-4xl font-medium text-muted-foreground/40">/100</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="rounded-3xl bg-card/50 backdrop-blur-sm border border-border/40 p-8 md:p-10 shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={isExpanded ? "expanded" : "collapsed"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {visibleBlocks.map((block, i) => {
                  if (block.type === "heading") {
                    return (
                      <motion.h3
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="text-xl md:text-2xl font-bold text-foreground pt-4 first:pt-0 flex items-center gap-3"
                      >
                        <span className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-interu-purple" />
                        {block.content}
                      </motion.h3>
                    );
                  }

                  if (block.type === "list" && block.items) {
                    return (
                      <ul key={i} className="space-y-4 pl-4">
                        {block.items.map((item, j) => (
                          <motion.li
                            key={j}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (i + j) * 0.03 }}
                            className="flex gap-4 text-base text-muted-foreground leading-relaxed"
                          >
                            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-r from-primary to-interu-purple mt-2" />
                            <span>{renderInlineMarkdown(item)}</span>
                          </motion.li>
                        ))}
                      </ul>
                    );
                  }

                  return (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="text-base text-muted-foreground leading-relaxed"
                    >
                      {renderInlineMarkdown(block.content)}
                    </motion.p>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Expand/Collapse */}
            {isLongContent && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-sm font-medium text-primary transition-colors"
              >
                {isExpanded ? (
                  <>
                    Show less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Show full analysis <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SummarySectionExp;
