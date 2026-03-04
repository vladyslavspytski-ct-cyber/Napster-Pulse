import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, BarChart3, RefreshCw, Sparkles, Users, Beaker } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInterviewDashboard, DashboardSection } from "@/hooks/api/useInterviewDashboard";
import SectionRendererExp from "@/components/interview-dashboard/SectionRendererExp";

/**
 * Experimental Interview Analysis page with enhanced visual design.
 * This is a test version for exploring new UI patterns.
 */
const InterviewAnalysisExp = () => {
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

  const hasSections = data.sections && data.sections.length > 0;
  const hasSummarySection = data.sections.some((s) => s.type === "summary");

  // Organize sections by priority, grouping consecutive grid-type sections
  const organizedSections = organizeSectionsByPriority(data.sections);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        {/* Top bar with back button and experimental badge */}
        <div className="section-container max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="-ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Results
            </Button>

            {/* Experimental badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-semibold"
            >
              <Beaker className="w-3.5 h-3.5" />
              Experimental Design
            </motion.div>
          </div>
        </div>

        {/* Default Hero when no summary section */}
        {!hasSummarySection && (
          <DefaultHeroExp title={data.title} completedCount={data.completed_count} />
        )}

        {/* No sections fallback */}
        {!hasSections && <NoSectionsState completedCount={data.completed_count} />}

        {/* Render sections in priority order */}
        {organizedSections.map((group, groupIndex) => {
          // Grid group - render side by side
          if (group.type === "grid" && group.sections.length > 0) {
            return (
              <div key={`grid-${groupIndex}`} className="section-container max-w-7xl mx-auto">
                <div className={`grid grid-cols-1 ${group.sections.length >= 2 ? "lg:grid-cols-2" : ""} gap-0`}>
                  {group.sections.map((section, index) => {
                    const isLastOdd = group.sections.length >= 2 && group.sections.length % 2 === 1 && index === group.sections.length - 1;
                    return (
                      <div
                        key={`${section.type}-${section.priority ?? index}`}
                        className={`min-w-0 ${isLastOdd ? "lg:col-span-2" : ""}`}
                      >
                        <SectionRendererExp
                          section={section}
                          title={data.title}
                          completedCount={data.completed_count}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          // Single section - render full width
          if (group.type === "single" && group.sections[0]) {
            return (
              <SectionRendererExp
                key={`${group.sections[0].type}-${group.sections[0].priority ?? groupIndex}`}
                section={group.sections[0]}
                title={data.title}
                completedCount={data.completed_count}
              />
            );
          }

          return null;
        })}
      </main>

      <Footer />
    </div>
  );
};

// Section group for rendering
interface SectionGroup {
  type: "single" | "grid";
  sections: DashboardSection[];
}

// Organize sections by priority, grouping consecutive grid-type sections together
function organizeSectionsByPriority(sections: DashboardSection[]): SectionGroup[] {
  // Sort all sections by priority first
  const sortedSections = [...sections].sort((a, b) => {
    const priorityA = a.priority ?? 999;
    const priorityB = b.priority ?? 999;
    return priorityA - priorityB;
  });

  // Sections that work well in a grid (side by side)
  const gridTypes = ["recurring_themes", "key_ideas", "red_flags"];

  const result: SectionGroup[] = [];
  let currentGridGroup: DashboardSection[] = [];

  for (const section of sortedSections) {
    const isGridType = gridTypes.includes(section.type);

    if (isGridType) {
      // Add to current grid group
      currentGridGroup.push(section);
    } else {
      // Flush any pending grid group first
      if (currentGridGroup.length > 0) {
        result.push({ type: "grid", sections: currentGridGroup });
        currentGridGroup = [];
      }
      // Add as single section
      result.push({ type: "single", sections: [section] });
    }
  }

  // Flush remaining grid group
  if (currentGridGroup.length > 0) {
    result.push({ type: "grid", sections: currentGridGroup });
  }

  return result;
}

// Enhanced default hero
interface DefaultHeroExpProps {
  title: string;
  completedCount: number;
}

const DefaultHeroExp = ({ title, completedCount }: DefaultHeroExpProps) => (
  <section className="relative py-20 md:py-28 overflow-hidden">
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-background to-interu-purple/[0.06]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-primary/[0.04] blur-[100px]" />
    </div>

    <div className="section-container relative z-10 max-w-7xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-interu-purple/15 border border-primary/20 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold bg-gradient-to-r from-primary to-interu-purple bg-clip-text text-transparent">
            Interview Analysis
          </span>
        </motion.div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
          {title}
        </h1>

        <p className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 border border-border/40 text-sm text-muted-foreground">
          <Users className="w-4 h-4" /> {completedCount} participants
        </p>
      </motion.div>
    </div>
  </section>
);

// Loading State
const LoadingState = () => (
  <div className="section-container max-w-7xl mx-auto">
    <div className="py-20 text-center">
      <Skeleton className="h-10 w-64 mx-auto mb-6" />
      <Skeleton className="h-16 w-3/4 mx-auto mb-4" />
      <Skeleton className="h-6 w-48 mx-auto" />
    </div>

    <div className="py-8">
      <div className="flex flex-wrap justify-center gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-48 rounded-2xl" />
        ))}
      </div>
    </div>

    <div className="py-16 grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-40 rounded-2xl" />
      ))}
    </div>
  </div>
);

// Error State
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

// Not Found State
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

// Empty State
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

// No Sections State
interface NoSectionsStateProps {
  completedCount: number;
}

const NoSectionsState = ({ completedCount }: NoSectionsStateProps) => (
  <section className="section-container max-w-7xl mx-auto py-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center text-center py-12 px-6 rounded-3xl border border-border/40 bg-card/50 backdrop-blur-sm"
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

export default InterviewAnalysisExp;
