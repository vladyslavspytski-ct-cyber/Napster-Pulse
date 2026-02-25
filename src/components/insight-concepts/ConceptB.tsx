/**
 * Concept B — Bold AI Insight Canvas
 * Expressive, dynamic, content-forward. Dark-accent hero, strong visual rhythm,
 * asymmetric sections, large typography, vibrant accent splashes.
 */
import { motion } from "framer-motion";
import {
  Sparkles, Users, Zap, AlertTriangle, MessageCircle,
  Lightbulb, Target, Award, TrendingUp, TrendingDown, Minus,
} from "lucide-react";
import { INSIGHT_MOCK } from "@/lib/mockInsightData";

const pop = (delay = 0) => ({
  initial: { opacity: 0, y: 24, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

const ConceptB = () => {
  const d = INSIGHT_MOCK;
  const maxTheme = Math.max(...d.recurring_themes.map((t) => t.weight));

  return (
    <div className="space-y-0">
      {/* ─── Hero: Bold Canvas ─── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Multi-layer gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-background to-interu-purple/[0.04]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/[0.04] blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-accent/[0.05] blur-[80px]" />

        <div className="section-container relative z-10 max-w-6xl mx-auto text-center">
          <motion.div {...pop(0)} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/10 text-primary text-sm font-semibold mx-auto">
              <Sparkles className="w-4 h-4" />
              AI-Powered Insight Canvas
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05]">
              {d.title}
            </h1>

            <p className="max-w-2xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed">
              {d.summary}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground pt-2">
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-4 h-4" /> {d.completed_count} participants
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                {d.overall_status}
              </span>
            </div>
          </motion.div>

          {/* Giant score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mt-14 inline-flex items-baseline gap-2"
          >
            <span className="text-9xl md:text-[10rem] font-black tracking-tighter text-foreground/90 leading-none">
              {d.overall_score}
            </span>
            <span className="text-3xl md:text-4xl font-medium text-muted-foreground/50">/100</span>
          </motion.div>
        </div>
      </section>

      {/* ─── Stat Ribbon ─── */}
      <section className="border-y border-border/50 bg-card/40">
        <div className="section-container max-w-6xl mx-auto py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {d.stats_cards.map((s, i) => (
              <motion.div key={s.label} {...pop(0.05 * i)} className="text-center space-y-1">
                <p className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
                {s.change && (
                  <p className={`text-xs font-semibold inline-flex items-center gap-0.5 ${s.trend === "up" ? "text-emerald-600" : s.trend === "down" ? "text-primary" : "text-muted-foreground"}`}>
                    {s.trend === "up" ? <TrendingUp className="w-3 h-3" /> : s.trend === "down" ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    {s.change}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Word Cloud — Full-width immersive ─── */}
      <section className="section-container max-w-6xl mx-auto py-16 md:py-20">
        <motion.div {...pop(0)} className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Recurring Themes</h2>
          <p className="text-sm text-muted-foreground mt-2">What participants said most</p>
        </motion.div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-x-8 md:gap-y-5">
          {d.word_cloud
            .sort((a, b) => b.weight - a.weight)
            .map((item, i) => {
              const ratio = item.weight / maxTheme;
              const size = 1 + ratio * 2.2;
              const opacity = 0.4 + ratio * 0.6;
              return (
                <motion.span
                  key={item.word}
                  initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
                  whileInView={{ opacity, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.04 * i }}
                  className="font-bold text-primary cursor-default hover:text-foreground transition-colors"
                  style={{ fontSize: `${size}rem`, lineHeight: 1.2 }}
                >
                  {item.word}
                </motion.span>
              );
            })}
        </div>
      </section>

      {/* ─── Asymmetric: Benchmarks (wide) + Red Flags (narrow) ─── */}
      <section className="section-container max-w-6xl mx-auto pb-16 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Benchmarks — spans 3 */}
        <motion.div {...pop(0)} className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Criteria Benchmarks</h2>
          </div>
          {d.criteria_benchmarks.map((b, i) => (
            <motion.div key={b.criteria} {...pop(0.05 * i)} className="p-4 rounded-xl bg-card border border-border/40 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-foreground">{b.criteria}</span>
                <span className="text-sm font-bold text-primary tabular-nums">{b.score}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--interu-purple)))` }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${b.score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.06 }}
                />
              </div>
              <p className="text-xs text-muted-foreground">P{b.percentile} percentile</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Red Flags — spans 2 */}
        <motion.div {...pop(0.15)} className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-foreground">Red Flags</h2>
          </div>
          {d.red_flags.map((f, i) => (
            <motion.div
              key={f.issue}
              {...pop(0.05 * i)}
              className="p-4 rounded-xl border border-border/40 bg-card space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${f.severity === "high" ? "bg-destructive" : f.severity === "medium" ? "bg-accent" : "bg-muted-foreground/40"}`} />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{f.severity}</span>
              </div>
              <p className="text-sm text-foreground">{f.issue}</p>
              <p className="text-xs text-muted-foreground">{f.occurrences} occurrences</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── Leaderboard — Horizontal spotlight ─── */}
      <section className="bg-muted/30 border-y border-border/40">
        <div className="section-container max-w-6xl mx-auto py-14">
          <motion.div {...pop(0)} className="flex items-center gap-2 mb-8">
            <Award className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Top Performers</h2>
          </motion.div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
            {d.leaderboard.map((entry, i) => (
              <motion.div
                key={entry.name}
                {...pop(0.08 * i)}
                className={`flex-shrink-0 w-56 p-5 rounded-2xl border snap-start ${i === 0 ? "bg-primary/[0.04] border-primary/20" : "bg-card border-border/40"}`}
              >
                <span className={`inline-flex w-8 h-8 rounded-lg items-center justify-center text-sm font-bold mb-3 ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  #{entry.rank}
                </span>
                <p className="text-base font-bold text-foreground">{entry.name}</p>
                <p className="text-3xl font-black text-foreground mt-2 tabular-nums">{entry.score}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {entry.highlights.map((h) => (
                    <span key={h} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/8 text-primary">{h}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Full-width: Quotes ─── */}
      <section className="section-container max-w-6xl mx-auto py-16">
        <motion.div {...pop(0)} className="flex items-center gap-2 mb-8">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Participant Voices</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {d.top_quotes.map((q, i) => (
            <motion.blockquote
              key={i}
              {...pop(0.08 * i)}
              className="relative p-6 rounded-2xl bg-card border border-border/40"
            >
              <MessageCircle className="w-8 h-8 text-primary/10 absolute top-4 right-4" />
              <p className="text-base leading-relaxed text-foreground/80 italic relative z-10">"{q}"</p>
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* ─── Recommendations — Numbered timeline ─── */}
      <section className="section-container max-w-6xl mx-auto pb-20">
        <motion.div {...pop(0)} className="flex items-center gap-2 mb-8">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">AI Recommendations</h2>
        </motion.div>
        <div className="relative pl-8 space-y-6">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent" />
          {d.key_ideas.map((idea, i) => (
            <motion.div key={i} {...pop(0.08 * i)} className="relative flex items-start gap-4">
              <span className="absolute left-[-17px] w-8 h-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-bold text-primary z-10">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-foreground/80 pt-1">{idea}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ConceptB;
