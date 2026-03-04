import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, BarChart3, RefreshCw, Sparkles, Users, FlaskConical } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInterviewDashboard } from "@/hooks/api/useInterviewDashboard";
import SectionRendererV2 from "@/components/interview-dashboard-v2/SectionRendererV2";

const InterviewAnalysisV2 = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error, notFound, refetch } = useInterviewDashboard({
    interviewId,
    enabled: !!interviewId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-24 pb-16"><LoadingState /></main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <ErrorState error={error} onRetry={refetch} onBack={() => navigate("/dashboard")} />
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <NotFoundState onBack={() => navigate("/dashboard")} />
        </main>
        <Footer />
      </div>
    );
  }

  const hasSections = data.sections && data.sections.length > 0;
  const hasSummarySection = data.sections.some((s) => s.type === "summary");

  // Group sections for smarter layout: "small" sections can pair side-by-side
  const smallTypes = new Set(["recurring_themes", "word_cloud", "key_ideas", "red_flags"]);

  // Build layout groups: consecutive small sections get paired
  const layoutGroups: { sections: typeof data.sections; layout: "full" | "grid" }[] = [];
  let smallBuffer: typeof data.sections = [];

  const flushSmall = () => {
    if (smallBuffer.length === 0) return;
    layoutGroups.push({ sections: [...smallBuffer], layout: "grid" });
    smallBuffer = [];
  };

  for (const section of data.sections) {
    if (smallTypes.has(section.type)) {
      smallBuffer.push(section);
      if (smallBuffer.length === 2) flushSmall();
    } else {
      flushSmall();
      layoutGroups.push({ sections: [section], layout: "full" });
    }
  }
  flushSmall();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        {/* Back + badge */}
        <div className="section-container max-w-6xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="-ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Results
          </Button>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
            <FlaskConical className="w-3 h-3" />
            Experimental
          </span>
        </div>

        {/* Hero when no summary section */}
        {!hasSummarySection && (
          <V2Hero title={data.title} completedCount={data.completed_count} />
        )}

        {!hasSections && <NoSectionsState completedCount={data.completed_count} />}

        {/* Dynamic layout groups */}
        <div className="section-container max-w-6xl mx-auto">
          {layoutGroups.map((group, gi) => {
            if (group.layout === "grid" && group.sections.length === 2) {
              return (
                <div key={gi} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {group.sections.map((section, si) => (
                    <div key={`${section.type}-${gi}-${si}`}>
                      <SectionRendererV2
                        section={section}
                        title={data.title}
                        completedCount={data.completed_count}
                      />
                    </div>
                  ))}
                </div>
              );
            }
            return group.sections.map((section, si) => (
              <SectionRendererV2
                key={`${section.type}-${gi}-${si}`}
                section={section}
                title={data.title}
                completedCount={data.completed_count}
              />
            ));
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};

/* ── V2 Hero ── */
const V2Hero = ({ title, completedCount }: { title: string; completedCount: number }) => (
  <section className="relative py-14 md:py-20 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-background to-interu-purple/[0.04]" />
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-primary/[0.05] blur-[120px]" />
    <div className="section-container relative z-10 max-w-6xl mx-auto text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/10 text-primary text-sm font-semibold mx-auto">
          <Sparkles className="w-4 h-4" />
          Interview Analysis v2
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="w-4 h-4" /> {completedCount} participants
        </p>
      </motion.div>
    </div>
  </section>
);

/* ── Utility states ── */
const LoadingState = () => (
  <div className="section-container max-w-6xl mx-auto">
    <div className="py-16 text-center">
      <Skeleton className="h-8 w-48 mx-auto mb-6" />
      <Skeleton className="h-14 w-3/4 mx-auto mb-4" />
      <Skeleton className="h-5 w-40 mx-auto" />
    </div>
    <div className="py-6 border-y border-border/50">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center space-y-2"><Skeleton className="h-8 w-16 mx-auto" /><Skeleton className="h-4 w-24 mx-auto" /></div>
        ))}
      </div>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry, onBack }: { error: Error; onRetry: () => void; onBack: () => void }) => (
  <div className="section-container max-w-xl mx-auto py-20">
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Failed to Load</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">{error.message || "Something went wrong."}</p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
        <Button onClick={onRetry}><RefreshCw className="w-4 h-4 mr-2" />Retry</Button>
      </div>
    </motion.div>
  </div>
);

const NotFoundState = ({ onBack }: { onBack: () => void }) => (
  <div className="section-container max-w-xl mx-auto py-20">
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-6">
        <BarChart3 className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Not Found</h2>
      <p className="text-muted-foreground mb-6">This interview could not be found.</p>
      <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
    </motion.div>
  </div>
);

const NoSectionsState = ({ completedCount }: { completedCount: number }) => (
  <section className="section-container max-w-6xl mx-auto py-16">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="flex flex-col items-center text-center py-12 px-6 rounded-2xl border border-border/40 bg-card"
    >
      <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mb-5">
        <BarChart3 className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No Analytics Yet</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        {completedCount > 0 ? "Analytics are still being processed." : "No completed responses yet."}
      </p>
    </motion.div>
  </section>
);

export default InterviewAnalysisV2;
