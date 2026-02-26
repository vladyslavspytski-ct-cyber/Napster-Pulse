import { motion } from "framer-motion";

const pop = (delay = 0) => ({
  initial: { opacity: 0, y: 24, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

// Backend can send either { word, weight } or { text, value }
interface WordCloudItemInput {
  word?: string;
  text?: string;
  weight?: number;
  value?: number;
}

interface WordCloudSectionProps {
  data: WordCloudItemInput[];
}

export const WordCloudSection = ({ data }: WordCloudSectionProps) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  // Normalize data - handle both { word, weight } and { text, value } formats
  const normalizedData = data.map((item) => ({
    word: item.word ?? item.text ?? "",
    weight: item.weight ?? item.value ?? 1,
  }));

  const maxWeight = Math.max(...normalizedData.map((t) => t.weight));
  const sortedData = [...normalizedData].sort((a, b) => b.weight - a.weight);

  // Limit to top 30 words for performance
  const displayData = sortedData.slice(0, 30);

  return (
    <section className="section-container max-w-6xl mx-auto py-16 md:py-20">
      <motion.div {...pop(0)} className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Key Topics</h2>
        <p className="text-sm text-muted-foreground mt-2">What participants mentioned most</p>
      </motion.div>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-x-8 md:gap-y-5">
        {displayData.map((item, i) => {
          const ratio = item.weight / maxWeight;
          const size = 0.9 + ratio * 1.8;
          const opacity = 0.5 + ratio * 0.5;
          return (
            <motion.span
              key={`${item.word}-${i}`}
              initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
              whileInView={{ opacity, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.03 * i }}
              className="font-bold text-primary cursor-default hover:text-foreground transition-colors"
              style={{ fontSize: `${size}rem`, lineHeight: 1.2 }}
            >
              {item.word}
            </motion.span>
          );
        })}
      </div>
    </section>
  );
};

export default WordCloudSection;
