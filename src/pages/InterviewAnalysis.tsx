import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Users, CalendarDays } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import AnimatedKPI from "@/components/analytics/AnimatedKPI";
import AIInsightBlock from "@/components/analytics/AIInsightBlock";
import DynamicChartCard from "@/components/analytics/DynamicChartCard";
import { MOCK_ANALYTICS } from "@/lib/mockAnalyticsData";

const PRIMARY_TYPES = new Set(["radar", "score"]);
const WIDE_TYPES = new Set(["bar", "horizontal_bar", "line", "area"]);

const InterviewAnalysis = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const data = MOCK_ANALYTICS;

  // Classify charts into tiers
  const primaryCharts = data.aggregate_chart_results.filter(c => PRIMARY_TYPES.has(c.chart_type));
  const secondaryCharts = data.aggregate_chart_results.filter(c => !PRIMARY_TYPES.has(c.chart_type));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        {/* ── Hero Section ── */}
        <section
          className="relative overflow-hidden"
          style={{ background: "var(--analytics-hero-gradient)" }}
        >
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="section-container max-w-7xl mx-auto relative z-10 py-12 md:py-16 lg:py-20">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="gap-2 text-muted-foreground hover:text-foreground mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </motion.div>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 lg:gap-16">
              {/* Left: Title + Meta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-5 flex-1 min-w-0"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.15] tracking-tight">
                  {data.interview_title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {data.completed_count} completed
                  </span>
                  {data.created_at && (
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4" />
                      {new Date(data.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/8 text-primary text-xs font-medium">
                    ID: {interviewId}
                  </span>
                </div>

                {/* AI Insight — placed closer to context */}
                <div className="pt-2">
                  <AIInsightBlock
                    insight="This interview shows strong consistency across candidates, with highest alignment in Performance & Impact. Communication scores are trending upward week-over-week, suggesting effective development in this competency area."
                  />
                </div>
              </motion.div>

              {/* Right: KPI — visually dominant */}
              {data.aggregate_overall_score !== undefined && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                  className="flex-shrink-0 lg:pt-2"
                >
                  <AnimatedKPI value={data.aggregate_overall_score} />
                </motion.div>
              )}
            </div>
          </div>

          {/* Bottom fade into content */}
          <div className="h-16 bg-gradient-to-b from-transparent to-background" />
        </section>

        {/* ── Primary Charts (Radar / Score) ── */}
        {primaryCharts.length > 0 && (
          <section className="section-container max-w-7xl mx-auto mt-2 md:mt-4">
            <div className={`grid gap-6 md:gap-8 ${
              primaryCharts.length === 1
                ? "grid-cols-1 max-w-3xl mx-auto"
                : "grid-cols-1 md:grid-cols-2"
            }`}>
              {primaryCharts.map((chart, i) => (
                <DynamicChartCard
                  key={chart.chart_name}
                  chart={chart}
                  index={i}
                  tier="primary"
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Secondary Charts ── */}
        {secondaryCharts.length > 0 && (
          <section className="section-container max-w-7xl mx-auto mt-10 md:mt-14">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mb-6"
            >
              <h2 className="text-lg font-semibold text-foreground">Detailed Breakdown</h2>
              <p className="text-sm text-muted-foreground mt-1">
                In-depth analysis across {data.completed_count} participants
              </p>
            </motion.div>

            <div className={`grid gap-5 md:gap-6 ${
              secondaryCharts.length === 1
                ? "grid-cols-1"
                : secondaryCharts.length === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}>
              {secondaryCharts.map((chart, i) => (
                <DynamicChartCard
                  key={chart.chart_name}
                  chart={chart}
                  index={i + primaryCharts.length}
                  tier="secondary"
                  isWide={WIDE_TYPES.has(chart.chart_type) && secondaryCharts.length >= 3}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default InterviewAnalysis;
