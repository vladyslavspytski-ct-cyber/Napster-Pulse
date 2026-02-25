/**
 * Concept A — Executive Intelligence Brief
 * Refined, minimal, strategic. Feels like reading a premium report.
 * Strong typographic hierarchy, generous whitespace, muted palette with precise accents.
 */
import { motion } from "framer-motion";
import {
  Sparkles, Users, TrendingUp, TrendingDown, Minus,
  AlertTriangle, Quote, Lightbulb, Shield, Crown,
} from "lucide-react";
import { INSIGHT_MOCK, type InsightData } from "@/lib/mockInsightData";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, delay },
});

const ConceptA = () => {
  const d = INSIGHT_MOCK;
  const maxTheme = Math.max(...d.recurring_themes.map((t) => t.weight));

  return (
    <div className="space-y-0">
      {/* ─── Hero: Executive Brief ─── */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/40 via-background to-muted/20" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-3xl" />

        <div className="section-container relative z-10 max-w-5xl mx-auto">
          <motion.div {...fade(0)} className="space-y-6">
            {/* Eyebrow */}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Intelligence Brief
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.08]">
              {d.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-4 h-4" /> {d.completed_count} participants
              </span>
              <span className="w-px h-4 bg-border" />
              <span>{new Date(d.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
          </motion.div>

          {/* Score + Summary side by side */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10 items-start">
            {/* Overall Score */}
            <motion.div {...fade(0.15)} className="flex flex-col items-center lg:items-start">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Overall Score
              </p>
              <div className="relative">
                <span className="text-7xl md:text-8xl font-bold text-foreground tabular-nums tracking-tighter">
                  {d.overall_score}
                </span>
                <span className="absolute -top-1 -right-5 text-lg font-medium text-primary">/100</span>
              </div>
              <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/8 text-primary">
                <Sparkles className="w-3 h-3" />
                {d.overall_status}
              </span>
            </motion.div>

            {/* AI Summary */}
            <motion.div {...fade(0.25)} className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/10 to-transparent" />
              <div className="pl-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Executive Summary
                </p>
                <p className="text-base md:text-lg leading-relaxed text-foreground/75">
                  {d.summary}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider line */}
      <div className="section-container max-w-5xl mx-auto">
        <div className="h-px bg-border" />
      </div>

      {/* ─── Stat Cards ─── */}
      <section className="section-container max-w-5xl mx-auto py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {d.stats_cards.map((s, i) => (
            <motion.div
              key={s.label}
              {...fade(0.08 * i)}
              className="p-5 rounded-xl bg-card border border-border/50 space-y-1"
            >
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">{s.value}</p>
              {s.change && (
                <p className={`text-xs font-semibold flex items-center gap-1 ${s.trend === "up" ? "text-emerald-600" : s.trend === "down" ? "text-primary" : "text-muted-foreground"}`}>
                  {s.trend === "up" ? <TrendingUp className="w-3 h-3" /> : s.trend === "down" ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                  {s.change}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Criteria Benchmarks — Horizontal bars ─── */}
      <section className="section-container max-w-5xl mx-auto pb-14">
        <motion.div {...fade(0)}>
          <SectionTitle label="Criteria Benchmarks" icon={<Shield className="w-4 h-4" />} />
        </motion.div>
        <div className="mt-6 space-y-4">
          {d.criteria_benchmarks.map((b, i) => (
            <motion.div key={b.criteria} {...fade(0.06 * i)} className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-foreground">{b.criteria}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{b.score}/{b.max} · P{b.percentile}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-interu-purple"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${b.score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.06 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Two-col: Red Flags + Top Quotes ─── */}
      <section className="bg-muted/30">
        <div className="section-container max-w-5xl mx-auto py-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Red Flags */}
          <motion.div {...fade(0)}>
            <SectionTitle label="Red Flags" icon={<AlertTriangle className="w-4 h-4" />} />
            <div className="mt-5 space-y-3">
              {d.red_flags.map((f, i) => (
                <motion.div
                  key={f.issue}
                  {...fade(0.06 * i)}
                  className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border/40"
                >
                  <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${f.severity === "high" ? "bg-destructive" : f.severity === "medium" ? "bg-accent" : "bg-muted-foreground/40"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{f.issue}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.occurrences} occurrences</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quotes */}
          <motion.div {...fade(0.1)}>
            <SectionTitle label="Participant Voices" icon={<Quote className="w-4 h-4" />} />
            <div className="mt-5 space-y-4">
              {d.top_quotes.map((q, i) => (
                <motion.blockquote key={i} {...fade(0.06 * i)} className="relative pl-4">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-primary/20" />
                  <p className="text-sm leading-relaxed text-foreground/70 italic">"{q}"</p>
                </motion.blockquote>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Leaderboard ─── */}
      <section className="section-container max-w-5xl mx-auto py-14">
        <motion.div {...fade(0)}>
          <SectionTitle label="Top Performers" icon={<Crown className="w-4 h-4" />} />
        </motion.div>
        <div className="mt-6 space-y-2">
          {d.leaderboard.map((entry, i) => (
            <motion.div
              key={entry.name}
              {...fade(0.06 * i)}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${i === 0 ? "bg-primary/[0.03] border-primary/15" : "bg-card border-border/40"}`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {entry.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{entry.name}</p>
                <p className="text-xs text-muted-foreground">{entry.highlights.join(" · ")}</p>
              </div>
              <span className="text-lg font-bold tabular-nums text-foreground">{entry.score}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Recommendations ─── */}
      <section className="section-container max-w-5xl mx-auto pb-20">
        <motion.div {...fade(0)}>
          <SectionTitle label="Recommendations" icon={<Lightbulb className="w-4 h-4" />} />
        </motion.div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {d.key_ideas.map((idea, i) => (
            <motion.div
              key={i}
              {...fade(0.06 * i)}
              className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/40"
            >
              <span className="mt-0.5 w-6 h-6 rounded-md bg-primary/8 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-foreground/80">{idea}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

/* ── Reusable ── */
const SectionTitle = ({ label, icon }: { label: string; icon: React.ReactNode }) => (
  <div className="flex items-center gap-2">
    <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center text-primary">{icon}</div>
    <h2 className="text-lg font-semibold text-foreground">{label}</h2>
  </div>
);

export default ConceptA;
