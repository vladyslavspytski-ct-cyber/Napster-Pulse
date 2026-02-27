import { motion } from "framer-motion";
import { Award, Trophy, Medal } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Backend sends { name, rank, score, reason }
interface LeaderboardInput {
  name: string;
  rank: number;
  score: number;
  reason?: string;
  highlights?: string[];
}

interface LeaderboardSectionExpProps {
  data: LeaderboardInput[];
}

// Color styles for top 3 positions
const RANK_STYLES = {
  1: {
    bg: "from-amber-500/20 via-yellow-500/10 to-transparent",
    border: "border-amber-400/40",
    badge: "bg-gradient-to-br from-amber-500 to-yellow-600",
    icon: Trophy,
  },
  2: {
    bg: "from-slate-400/20 via-gray-400/10 to-transparent",
    border: "border-slate-400/40",
    badge: "bg-gradient-to-br from-slate-400 to-gray-500",
    icon: Medal,
  },
  3: {
    bg: "from-orange-600/20 via-amber-600/10 to-transparent",
    border: "border-orange-500/40",
    badge: "bg-gradient-to-br from-orange-600 to-amber-700",
    icon: Medal,
  },
};

const DEFAULT_STYLE = {
  bg: "from-primary/10 via-primary/5 to-transparent",
  border: "border-border/40",
  badge: "bg-muted",
  icon: Award,
};

export const LeaderboardSectionExp = ({ data }: LeaderboardSectionExpProps) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <section className="relative py-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] via-transparent to-primary/[0.02]" />

        <div className="section-container max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Ranked Participants</h2>
              <p className="text-sm text-muted-foreground">Top performers based on interview scores</p>
            </div>
          </motion.div>

          {/* Horizontal scroll container */}
          <div className="overflow-x-auto overflow-y-hidden -mx-4 px-4 pb-4 scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
            <div className="flex gap-4 snap-x snap-mandatory" style={{ minWidth: "max-content" }}>
              {data.map((entry, i) => {
                const style = RANK_STYLES[entry.rank as 1 | 2 | 3] ?? DEFAULT_STYLE;
                const IconComponent = style.icon;
                const isTopThree = entry.rank <= 3;

                return (
                  <motion.div
                    key={`${entry.name}-${i}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08, type: "spring" }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className={`
                      relative group flex-shrink-0 w-60 p-5 rounded-2xl snap-start
                      bg-gradient-to-br ${style.bg}
                      border ${style.border}
                      backdrop-blur-sm
                      transition-all duration-300
                    `}
                  >
                    {/* Rank badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`inline-flex w-10 h-10 rounded-xl items-center justify-center ${style.badge} ${
                          isTopThree ? "text-white shadow-lg" : "text-muted-foreground"
                        }`}
                      >
                        {isTopThree ? (
                          <IconComponent className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-bold">#{entry.rank}</span>
                        )}
                      </span>
                      {isTopThree && (
                        <span className="text-xs font-semibold text-muted-foreground">
                          #{entry.rank}
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <p className="text-base font-bold text-foreground truncate">{entry.name}</p>

                    {/* Score */}
                    <p className="text-4xl font-black text-foreground mt-2 tabular-nums">
                      {entry.score}
                    </p>

                    {/* Highlights badges */}
                    {entry.highlights && entry.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {entry.highlights.slice(0, 3).map((h) => (
                          <span
                            key={h}
                            className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Reason with tooltip */}
                    {entry.reason && !entry.highlights && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-xs text-muted-foreground mt-4 line-clamp-2 cursor-help hover:text-foreground/70 transition-colors">
                            {entry.reason}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          className="max-w-xs text-sm"
                        >
                          {entry.reason}
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* Hover glow effect */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${style.bg} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300 -z-10`} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default LeaderboardSectionExp;
