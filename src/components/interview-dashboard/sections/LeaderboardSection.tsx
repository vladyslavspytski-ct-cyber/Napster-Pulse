import { motion } from "framer-motion";
import { Award } from "lucide-react";

const pop = (delay = 0) => ({
  initial: { opacity: 0, y: 24, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

// Backend sends { name, rank, score, reason }
// or could send { name, rank, score, highlights[] }
interface LeaderboardInput {
  name: string;
  rank: number;
  score: number;
  reason?: string;
  highlights?: string[];
}

interface LeaderboardSectionProps {
  data: LeaderboardInput[];
}

export const LeaderboardSection = ({ data }: LeaderboardSectionProps) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  return (
    <section className="bg-muted/30 border-y border-border/40 overflow-hidden">
      <div className="section-container max-w-6xl mx-auto py-14">
        <motion.div {...pop(0)} className="flex items-center gap-2 mb-8">
          <Award className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Ranked Participants</h2>
        </motion.div>
        {/* Horizontal scroll container - no vertical scroll */}
        <div className="overflow-x-auto overflow-y-hidden -mx-4 px-4 pb-3 scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
          <div className="flex gap-4 snap-x snap-mandatory" style={{ minWidth: "max-content" }}>
            {data.map((entry, i) => (
              <motion.div
                key={`${entry.name}-${i}`}
                {...pop(0.08 * i)}
                className={`flex-shrink-0 w-56 p-5 rounded-2xl border snap-start ${
                  i === 0 ? "bg-primary/[0.04] border-primary/20" : "bg-card border-border/40"
                }`}
              >
                <span
                  className={`inline-flex w-8 h-8 rounded-lg items-center justify-center text-sm font-bold mb-3 ${
                    i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  #{entry.rank}
                </span>
                <p className="text-base font-bold text-foreground">{entry.name}</p>
                <p className="text-3xl font-black text-foreground mt-2 tabular-nums">{entry.score}</p>
                {/* Support both highlights array and reason string */}
                {entry.highlights && entry.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {entry.highlights.map((h) => (
                      <span
                        key={h}
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/8 text-primary"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                )}
                {entry.reason && !entry.highlights && (
                  <p className="text-xs text-muted-foreground mt-3 line-clamp-3">{entry.reason}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
