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

const WIDE_TYPES = new Set(["bar", "horizontal_bar", "line", "area"]);

const InterviewAnalysis = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const data = MOCK_ANALYTICS;

  const chartCount = data.aggregate_chart_results.length;

  // Determine grid class based on chart count
  const gridClass =
    chartCount === 1
      ? "grid-cols-1"
      : chartCount === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        {/* ── Hero Section ── */}
        <section
          className="relative overflow-hidden"
          style={{ background: "var(--analytics-hero-gradient)" }}
        >
          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="section-container max-w-7xl mx-auto relative z-10 py-10 md:py-14">
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
                className="gap-2 text-muted-foreground hover:text-foreground mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </motion.div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Left: Title + Meta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 flex-1 min-w-0"
              >
                <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-tight tracking-tight">
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
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    ID: {interviewId}
                  </span>
                </div>
              </motion.div>

              {/* Right: KPI */}
              {data.aggregate_overall_score !== undefined && (
                <div className="flex-shrink-0">
                  <AnimatedKPI value={data.aggregate_overall_score} />
                </div>
              )}
            </div>

            {/* AI Insight */}
            <div className="mt-8">
              <AIInsightBlock
                insight="This interview shows strong consistency across candidates, with highest alignment in Performance & Impact. Communication scores are trending upward week-over-week, suggesting effective development in this competency area."
              />
            </div>
          </div>
        </section>

        {/* ── Analytics Grid ── */}
        <section className="section-container max-w-7xl mx-auto mt-10 md:mt-14">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-xl font-semibold text-foreground">Aggregate Analytics</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Dynamic assessment breakdown across all {data.completed_count} participants
            </p>
          </motion.div>

          <div className={`grid ${gridClass} gap-5 md:gap-6`}>
            {data.aggregate_chart_results.map((chart, i) => (
              <DynamicChartCard
                key={chart.chart_name}
                chart={chart}
                index={i}
                isWide={WIDE_TYPES.has(chart.chart_type) && chartCount > 1}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default InterviewAnalysis;
