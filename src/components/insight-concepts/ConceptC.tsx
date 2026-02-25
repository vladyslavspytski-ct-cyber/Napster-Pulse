/**
 * Concept C — Deep Analytics Studio
 * Structured, analytical, layered. Feels like a professional analysis workspace.
 * Dense information design, tabular layouts, subtle depth via layered panels.
 */
import { motion } from "framer-motion";
import {
  Sparkles, Users, CalendarDays, BarChart3, AlertTriangle,
  Quote, Lightbulb, Shield, Crown, Activity, TrendingUp, TrendingDown, Minus,
} from "lucide-react";
import { INSIGHT_MOCK } from "@/lib/mockInsightData";

const slide = (delay = 0) => ({
  initial: { opacity: 0, x: -12 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45, delay },
});

const ConceptC = () => {
  const d = INSIGHT_MOCK;
  const maxTheme = Math.max(...d.recurring_themes.map((t) => t.weight));

  return (
    <div className="space-y-0">
      {/* ─── Hero: Studio Header ─── */}
      <section className="border-b border-border/50 bg-card/50">
        <div className="section-container max-w-7xl mx-auto py-10 md:py-14">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            {/* Left */}
            <motion.div {...slide(0)} className="space-y-3 flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider font-semibold">Analysis Studio</span>
                <span className="w-px h-3 bg-border" />
                <span>{new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">{d.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" />{d.completed_count} participants</span>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/8 text-primary">{d.overall_status}</span>
              </div>
            </motion.div>

            {/* Right: Score compact */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-end gap-3"
            >
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Overall Score</p>
                <span className="text-5xl md:text-6xl font-black text-foreground tabular-nums leading-none">{d.overall_score}</span>
              </div>
              <span className="text-lg text-muted-foreground/40 mb-1">/100</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Stats bar ─── */}
      <section className="border-b border-border/30">
        <div className="section-container max-w-7xl mx-auto py-4 flex flex-wrap items-center gap-6 md:gap-10">
          {d.stats_cards.map((s, i) => (
            <motion.div key={s.label} {...slide(0.05 * i)} className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground tabular-nums">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
              {s.change && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${s.trend === "up" ? "bg-emerald-50 text-emerald-600" : s.trend === "down" ? "bg-primary/8 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {s.change}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── AI Summary Panel ─── */}
      <section className="section-container max-w-7xl mx-auto py-10">
        <motion.div {...slide(0)} className="rounded-xl border border-border/50 bg-card p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-interu-purple to-accent opacity-40" />
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">AI Executive Summary</p>
              <p className="text-sm md:text-base leading-relaxed text-foreground/75">{d.summary}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Main grid: 3 columns on desktop ─── */}
      <section className="section-container max-w-7xl mx-auto pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1: Benchmarks — tall */}
          <motion.div {...slide(0)} className="lg:row-span-2 rounded-xl border border-border/40 bg-card p-5 space-y-4">
            <PanelHeader icon={<Shield className="w-4 h-4" />} title="Criteria Benchmarks" />
            {d.criteria_benchmarks.map((b, i) => (
              <motion.div key={b.criteria} {...slide(0.05 * i)} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">{b.criteria}</span>
                  <span className="tabular-nums text-muted-foreground font-semibold">{b.score}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${b.score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.08 * i }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">Percentile: P{b.percentile}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Col 2: Recurring Themes — compact cloud */}
          <motion.div {...slide(0.1)} className="rounded-xl border border-border/40 bg-card p-5">
            <PanelHeader icon={<BarChart3 className="w-4 h-4" />} title="Recurring Themes" />
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {d.recurring_themes
                .sort((a, b) => b.weight - a.weight)
                .map((item, i) => {
                  const ratio = item.weight / maxTheme;
                  return (
                    <motion.span
                      key={item.word}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 0.4 + ratio * 0.6 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.03 * i }}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/8 text-primary cursor-default hover:bg-primary/15 transition-colors"
                      style={{ fontSize: `${0.7 + ratio * 0.3}rem` }}
                    >
                      {item.word}
                    </motion.span>
                  );
                })}
            </div>
          </motion.div>

          {/* Col 3: Red Flags */}
          <motion.div {...slide(0.15)} className="rounded-xl border border-border/40 bg-card p-5">
            <PanelHeader icon={<AlertTriangle className="w-4 h-4" />} title="Red Flags" />
            <div className="mt-4 space-y-3">
              {d.red_flags.map((f, i) => (
                <div key={f.issue} className="flex items-start gap-2.5">
                  <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${f.severity === "high" ? "bg-destructive" : f.severity === "medium" ? "bg-accent" : "bg-muted-foreground/40"}`} />
                  <div>
                    <p className="text-xs text-foreground leading-snug">{f.issue}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{f.occurrences}× · {f.severity}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Col 2-3: Leaderboard table */}
          <motion.div {...slide(0.1)} className="lg:col-span-2 rounded-xl border border-border/40 bg-card p-5">
            <PanelHeader icon={<Crown className="w-4 h-4" />} title="Top Performers" />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground uppercase tracking-wider border-b border-border/30">
                    <th className="text-left py-2 pr-3 font-semibold">#</th>
                    <th className="text-left py-2 pr-3 font-semibold">Participant</th>
                    <th className="text-left py-2 pr-3 font-semibold">Score</th>
                    <th className="text-left py-2 font-semibold">Strengths</th>
                  </tr>
                </thead>
                <tbody>
                  {d.leaderboard.map((entry, i) => (
                    <motion.tr
                      key={entry.name}
                      {...slide(0.04 * i)}
                      className={`border-b border-border/20 last:border-0 ${i === 0 ? "bg-primary/[0.02]" : ""}`}
                    >
                      <td className="py-2.5 pr-3">
                        <span className={`w-6 h-6 rounded text-[10px] font-bold inline-flex items-center justify-center ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          {entry.rank}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 font-medium text-foreground">{entry.name}</td>
                      <td className="py-2.5 pr-3 font-bold tabular-nums text-foreground">{entry.score}</td>
                      <td className="py-2.5">
                        <div className="flex gap-1.5 flex-wrap">
                          {entry.highlights.map((h) => (
                            <span key={h} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">{h}</span>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Bottom: Quotes + Recommendations side by side ─── */}
      <section className="section-container max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quotes */}
          <motion.div {...slide(0)} className="rounded-xl border border-border/40 bg-card p-5 space-y-4">
            <PanelHeader icon={<Quote className="w-4 h-4" />} title="Participant Voices" />
            {d.top_quotes.map((q, i) => (
              <motion.div key={i} {...slide(0.05 * i)} className="flex gap-3 items-start">
                <div className="w-0.5 rounded-full bg-primary/20 flex-shrink-0 self-stretch" />
                <p className="text-xs leading-relaxed text-foreground/70 italic">"{q}"</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Recommendations */}
          <motion.div {...slide(0.1)} className="rounded-xl border border-border/40 bg-card p-5 space-y-4">
            <PanelHeader icon={<Lightbulb className="w-4 h-4" />} title="Recommendations" />
            {d.key_ideas.map((idea, i) => (
              <motion.div key={i} {...slide(0.05 * i)} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded bg-primary/8 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-xs leading-relaxed text-foreground/75">{idea}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

/* ── Reusable panel header ── */
const PanelHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 rounded-md bg-primary/8 flex items-center justify-center text-primary">{icon}</div>
    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">{title}</h3>
  </div>
);

export default ConceptC;
