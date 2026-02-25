import { motion } from "framer-motion";
import { ArrowLeft, Users, Quote, Lightbulb, AlertTriangle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

/* ─── Mock Data ─── */
const MOCK = {
  title: "360 Feedback – Insight Analysis",
  completed_count: 12,
  overall_status: "Moderate Alignment",
  summary:
    "Overall, participants demonstrate strong collaboration but recurring concerns around communication clarity. Teams show high initiative yet inconsistencies in delegation and feedback loops create friction.",
  word_cloud: [
    { word: "communication", weight: 24 },
    { word: "alignment", weight: 18 },
    { word: "clarity", weight: 16 },
    { word: "support", weight: 12 },
    { word: "initiative", weight: 9 },
    { word: "delegation", weight: 8 },
    { word: "feedback", weight: 7 },
    { word: "ownership", weight: 6 },
    { word: "collaboration", weight: 14 },
    { word: "transparency", weight: 5 },
    { word: "accountability", weight: 10 },
    { word: "empathy", weight: 4 },
  ],
  top_issues: [
    { theme: "Communication clarity", mentions: 6 },
    { theme: "Delegation gaps", mentions: 4 },
    { theme: "Slow feedback loops", mentions: 3 },
    { theme: "Role ambiguity", mentions: 2 },
  ],
  quotes: [
    "Sometimes expectations are not clearly defined.",
    "The team works well together but alignment is inconsistent.",
    "Strong initiative but needs clearer communication.",
  ],
  key_ideas: [
    "Introduce weekly alignment sync.",
    "Create communication playbook.",
    "Define ownership more clearly.",
    "Establish structured feedback cadence.",
  ],
};

/* ─── Helpers ─── */
const stagger = (i: number) => ({ delay: 0.08 * i });

const wordScale = (weight: number, maxW: number) => {
  const ratio = weight / maxW;
  // font size from 0.85rem to 2.8rem
  const size = 0.85 + ratio * 1.95;
  // opacity from 0.45 to 1
  const opacity = 0.45 + ratio * 0.55;
  return { size, opacity };
};

/* ─── Page ─── */
const InsightDemo = () => {
  const navigate = useNavigate();
  const maxWeight = Math.max(...MOCK.word_cloud.map((w) => w.weight));
  const maxMentions = Math.max(...MOCK.top_issues.map((i) => i.mentions));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden">
          {/* Gradient bg */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)/0.08),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,hsl(var(--interu-purple)/0.06),transparent)]" />

          <div className="section-container relative z-10 py-10 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Dashboard
              </Button>
            </motion.div>

            <div className="max-w-3xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
              >
                {MOCK.title}
              </motion.h1>

              {/* Status badge + count */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex flex-wrap items-center gap-3 mt-5"
              >
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold bg-primary/10 text-primary border border-primary/15">
                  <Sparkles className="w-3.5 h-3.5" />
                  {MOCK.overall_status}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {MOCK.completed_count} completed
                </span>
              </motion.div>

              {/* AI Summary */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mt-8 relative"
              >
                <div className="absolute -left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-primary via-interu-purple to-accent opacity-60" />
                <div className="pl-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Summary
                  </p>
                  <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                    {MOCK.summary}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Content ── */}
        <div className="section-container mt-8 md:mt-12 space-y-12 md:space-y-16">
          {/* ── Word Cloud ── */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel icon={<Sparkles className="w-4 h-4" />} label="Recurring Themes" />
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 md:gap-x-7 md:gap-y-4 py-8 md:py-12 px-4 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/40">
              {MOCK.word_cloud
                .sort((a, b) => b.weight - a.weight)
                .map((item, i) => {
                  const { size, opacity } = wordScale(item.weight, maxWeight);
                  return (
                    <motion.span
                      key={item.word}
                      initial={{ opacity: 0, scale: 0.7 }}
                      whileInView={{ opacity, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, ...stagger(i) }}
                      className="font-semibold text-primary cursor-default transition-colors hover:text-foreground"
                      style={{ fontSize: `${size}rem`, lineHeight: 1.3 }}
                    >
                      {item.word}
                    </motion.span>
                  );
                })}
            </div>
          </motion.section>

          {/* ── Two-column: Issues + Quotes ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
            {/* Top Issues — wider */}
            <motion.section
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
            >
              <SectionLabel icon={<AlertTriangle className="w-4 h-4" />} label="Top Issues" />
              <div className="mt-5 space-y-3">
                {MOCK.top_issues.map((issue, i) => {
                  const pct = (issue.mentions / maxMentions) * 100;
                  return (
                    <motion.div
                      key={issue.theme}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, ...stagger(i) }}
                      className="group relative rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 hover:border-border transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-sm font-medium text-foreground">{issue.theme}</span>
                        <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                          {issue.mentions} mentions
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-interu-purple"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.15 + i * 0.08 }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            {/* Quotes — narrower */}
            <motion.section
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
            >
              <SectionLabel icon={<Quote className="w-4 h-4" />} label="Participant Voices" />
              <div className="mt-5 space-y-4">
                {MOCK.quotes.map((q, i) => (
                  <motion.blockquote
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ...stagger(i) }}
                    className="relative pl-4 py-3"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-accent/50" />
                    <p className="text-sm leading-relaxed text-foreground/75 italic">
                      "{q}"
                    </p>
                  </motion.blockquote>
                ))}
              </div>
            </motion.section>
          </div>

          {/* ── Ideas / Recommendations ── */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel icon={<Lightbulb className="w-4 h-4" />} label="Recommendations" />
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK.key_ideas.map((idea, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, ...stagger(i) }}
                  className="flex items-start gap-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/40 p-4 hover:border-primary/20 transition-colors"
                >
                  <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/80">{idea}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/* ── Reusable section label ── */
const SectionLabel = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-2">
    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
      {icon}
    </div>
    <h2 className="text-lg font-semibold text-foreground">{label}</h2>
  </div>
);

export default InsightDemo;
