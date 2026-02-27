import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Users, ChevronDown, ChevronUp } from "lucide-react";

const pop = (delay = 0) => ({
  initial: { opacity: 0, y: 24, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

// Backend sends { text, overall_score?, overall_status? }
interface SummaryDataInput {
  text: string;
  overall_score?: number;
  overall_status?: string;
}

interface SummarySectionProps {
  data: SummaryDataInput;
  title: string;
  completedCount: number;
}

// Parse markdown text into structured blocks
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

    // Check for heading (### or ##)
    const headingMatch = trimmed.match(/^#{2,3}\s+(.+)$/);
    if (headingMatch) {
      flushList();
      blocks.push({ type: "heading", content: headingMatch[1] });
      continue;
    }

    // Check for list item (* or -)
    const listMatch = trimmed.match(/^[\*\-]\s+(.+)$/);
    if (listMatch) {
      currentList.push(listMatch[1]);
      continue;
    }

    // Regular paragraph
    flushList();
    blocks.push({ type: "paragraph", content: trimmed });
  }

  flushList();
  return blocks;
}

// Render inline markdown (bold)
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add bold text
    parts.push(
      <strong key={key++} className="font-semibold text-foreground">
        {match[1]}
      </strong>
    );
    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

export const SummarySection = ({ data, title, completedCount }: SummarySectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse markdown content
  const blocks = useMemo(() => parseMarkdown(data.text || ""), [data.text]);

  // Check if content is long enough to need expansion (more than 2 sections)
  const headingCount = blocks.filter((b) => b.type === "heading").length;
  const isLongContent = headingCount > 2 || blocks.length > 8;

  // For collapsed view, show only first section
  const visibleBlocks = useMemo(() => {
    if (isExpanded || !isLongContent) return blocks;

    // Find first heading and include content until next heading
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
    <section className="relative py-14 md:py-20 overflow-hidden">
      {/* Multi-layer gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-background to-interu-purple/[0.04]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/[0.04] blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-accent/[0.05] blur-[80px]" />

      <div className="px-4 sm:px-6 relative z-10 max-w-5xl mx-auto">
        {/* Header - centered */}
        <motion.div {...pop(0)} className="text-center space-y-5 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/10 text-primary text-xs font-semibold mx-auto">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Insight Canvas
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            {title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Users className="w-4 h-4" /> {completedCount} participants
            </span>
            {data.overall_status && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                {data.overall_status}
              </span>
            )}
          </div>
        </motion.div>

        {/* Giant score - centered */}
        {data.overall_score !== undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <span className="text-8xl md:text-9xl font-black tracking-tighter text-foreground/90 leading-none">
              {data.overall_score}
            </span>
            <span className="text-2xl md:text-3xl font-medium text-muted-foreground/50">/100</span>
          </motion.div>
        )}

        {/* Markdown content - left aligned */}
        <motion.div {...pop(0.1)} className="max-w-4xl mx-auto">
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
                    <h3
                      key={i}
                      className="text-lg md:text-xl font-bold text-foreground pt-2 first:pt-0"
                    >
                      {block.content}
                    </h3>
                  );
                }

                if (block.type === "list" && block.items) {
                  return (
                    <ul key={i} className="space-y-3">
                      {block.items.map((item, j) => (
                        <li
                          key={j}
                          className="flex gap-3 text-sm md:text-base text-muted-foreground leading-relaxed"
                        >
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                          <span>{renderInlineMarkdown(item)}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p
                    key={i}
                    className="text-sm md:text-base text-muted-foreground leading-relaxed"
                  >
                    {renderInlineMarkdown(block.content)}
                  </p>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Expand/Collapse button */}
          {isLongContent && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
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
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default SummarySection;
