import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, BarChart3, RefreshCw, Sparkles, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInterviewDashboard } from "@/hooks/api/useInterviewDashboard";
import SectionRenderer from "@/components/interview-dashboard/SectionRenderer";

const InterviewAnalysis = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error, notFound, refetch } = useInterviewDashboard({
    interviewId,
    enabled: !!interviewId,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <LoadingState />
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
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

  // Not found state
  if (notFound) {
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

  // No data state
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <EmptyState onBack={() => navigate("/dashboard")} />
        </main>
        <Footer />
      </div>
    );
  }

  // Check if we have sections
  const hasSections = data.sections && data.sections.length > 0;

  // Check if we have a summary section
  const hasSummarySection = data.sections.some((s) => s.type === "summary");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        {/* Back button - always visible at top */}
        <div className="section-container max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="-ml-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Results
          </Button>
        </div>

        {/* Default Hero when no summary section */}
        {!hasSummarySection && (
          <DefaultHero title={data.title} completedCount={data.completed_count} />
        )}

        {/* No sections fallback */}
        {!hasSections && <NoSectionsState completedCount={data.completed_count} />}

        {/* Dynamic sections */}
        <div className="space-y-0">
          {data.sections.map((section, index) => (
            <SectionRenderer
              key={`${section.type}-${index}`}
              section={section}
              title={data.title}
              completedCount={data.completed_count}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Default Hero (when no summary section)
// ─────────────────────────────────────────────────────────────

interface DefaultHeroProps {
  title: string;
  completedCount: number;
}

const DefaultHero = ({ title, completedCount }: DefaultHeroProps) => (
  <section className="relative py-16 md:py-20 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-background to-interu-purple/[0.03]" />
    <div className="section-container relative z-10 max-w-6xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/10 text-primary text-sm font-semibold mx-auto">
          <Sparkles className="w-4 h-4" />
          Interview Analysis
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="w-4 h-4" /> {completedCount} participants
        </p>
      </motion.div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────
// Loading State
// ─────────────────────────────────────────────────────────────

const LoadingState = () => (
  <div className="section-container max-w-6xl mx-auto">
    {/* Hero skeleton */}
    <div className="py-16 md:py-20 text-center">
      <Skeleton className="h-8 w-48 mx-auto mb-6" />
      <Skeleton className="h-14 w-3/4 mx-auto mb-4" />
      <Skeleton className="h-5 w-40 mx-auto" />
      <Skeleton className="h-32 w-32 rounded-full mx-auto mt-10" />
    </div>

    {/* Stats skeleton */}
    <div className="py-6 border-y border-border/50">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center space-y-2">
            <Skeleton className="h-8 w-16 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        ))}
      </div>
    </div>

    {/* Content skeleton */}
    <div className="py-16 space-y-4">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Error State
// ─────────────────────────────────────────────────────────────

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
  onBack: () => void;
}

const ErrorState = ({ error, onRetry, onBack }: ErrorStateProps) => (
  <div className="section-container max-w-xl mx-auto py-20">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center"
    >
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Failed to Load</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {error.message || "Something went wrong while fetching the interview data."}
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>
        <Button onClick={onRetry}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Not Found State
// ─────────────────────────────────────────────────────────────

interface NotFoundStateProps {
  onBack: () => void;
}

const NotFoundState = ({ onBack }: NotFoundStateProps) => (
  <div className="section-container max-w-xl mx-auto py-20">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center"
    >
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-6">
        <BarChart3 className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Interview Not Found</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        This interview could not be found. It may have been deleted or the ID is invalid.
      </p>
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Results
      </Button>
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Empty State (no data returned)
// ─────────────────────────────────────────────────────────────

interface EmptyStateProps {
  onBack: () => void;
}

const EmptyState = ({ onBack }: EmptyStateProps) => (
  <div className="section-container max-w-xl mx-auto py-20">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center"
    >
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-6">
        <BarChart3 className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">No Data Available</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Could not load the interview data. Please try again later.
      </p>
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Results
      </Button>
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// No Sections State (data exists but no dashboard sections)
// ─────────────────────────────────────────────────────────────

interface NoSectionsStateProps {
  completedCount: number;
}

const NoSectionsState = ({ completedCount }: NoSectionsStateProps) => (
  <section className="section-container max-w-6xl mx-auto py-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center text-center py-12 px-6 rounded-2xl border border-border/40 bg-card"
    >
      <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mb-5">
        <BarChart3 className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No Analytics Yet</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        {completedCount > 0
          ? "This interview has completed responses but the analytics are still being processed. Check back soon."
          : "This interview does not have any completed responses yet. Analytics will appear once participants complete the interview."}
      </p>
    </motion.div>
  </section>
);

export default InterviewAnalysis;
