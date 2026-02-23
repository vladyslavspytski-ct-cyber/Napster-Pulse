import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Inbox, ChevronLeft, ChevronRight, AlertCircle, BarChart3, ExternalLink, ArrowRight, Mail, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import InterviewListItem from "@/components/dashboard-v2/InterviewListItem";
import ConductedRunCard from "@/components/dashboard-v2/ConductedRunCard";
import SentimentDistribution from "@/components/dashboard-v2/SentimentDistribution";
import MobileInterviewSelector from "@/components/dashboard-v2/MobileInterviewSelector";
import {
  InterviewTemplate,
  transformCompletedInterviewToTemplate,
  transformAttemptToRun,
} from "@/lib/mockDashboardV2Data";
import { useCompletedInterviews } from "@/hooks/api/useCompletedInterviews";
import { useAttempts } from "@/hooks/api/useAttempts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { mockAnalyticsInterviews, getMockAnalyticsRuns, type AnalyticsInterview } from "@/lib/mockAnalyticsData";

const INTERVIEWS_PER_PAGE = 10;
const RUNS_PER_PAGE = 4;

type SentimentFilter = "all" | "positive" | "neutral" | "negative";

const DashboardV2 = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State - Interviews
  const [selectedInterview, setSelectedInterview] = useState<InterviewTemplate | null>(null);
  const [interviewSearch, setInterviewSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // State - Runs
  const [runSearch, setRunSearch] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>("all");
  const [runsPage, setRunsPage] = useState(1);
  const [selectedMockInterview, setSelectedMockInterview] = useState<AnalyticsInterview | null>(null);

  // Fetch completed interviews from API with server-side pagination
  const interviewsOffset = (currentPage - 1) * INTERVIEWS_PER_PAGE;
  const {
    interviews: rawInterviews,
    total: interviewsTotal,
    isLoading: isLoadingInterviews,
    error: interviewsError,
  } = useCompletedInterviews({
    limit: INTERVIEWS_PER_PAGE,
    offset: interviewsOffset,
    search: interviewSearch,
  });

  // Transform interviews (already filtered by backend - only completed_count > 0)
  const allFilteredInterviews = useMemo(() => {
    if (!rawInterviews || !Array.isArray(rawInterviews)) return [];
    return rawInterviews.map(transformCompletedInterviewToTemplate);
  }, [rawInterviews]);

  // Calculate total pages from API response (defensive: handle undefined/NaN)
  const totalPages = Math.max(1, Math.ceil((interviewsTotal || 0) / INTERVIEWS_PER_PAGE));

  // With server-side pagination, paginatedInterviews is the filtered list from current page
  const paginatedInterviews = allFilteredInterviews;

  // Track previous page to detect page changes
  const prevPageRef = useRef(currentPage);

  // Clear selection when page changes to avoid showing stale data
  useEffect(() => {
    if (prevPageRef.current !== currentPage) {
      prevPageRef.current = currentPage;
      // Clear selection immediately when page changes - will be re-selected when new data arrives
      setSelectedInterview(null);
      setRunSearch("");
      setSentimentFilter("all");
      setRunsPage(1);
    }
  }, [currentPage]);

  // Auto-select first interview on initial load or when list changes
  useEffect(() => {
    // Select first interview if none selected and list is not empty
    if (!selectedInterview && paginatedInterviews.length > 0 && !isLoadingInterviews) {
      setSelectedInterview(paginatedInterviews[0]);
      setRunSearch("");
      setSentimentFilter("all");
      setRunsPage(1);
    }
    // If list becomes empty, clear selection
    if (allFilteredInterviews.length === 0 && !isLoadingInterviews) {
      setSelectedInterview(null);
    }
  }, [paginatedInterviews, allFilteredInterviews, selectedInterview, isLoadingInterviews]);

  // Fetch attempts for selected interview with pagination and sentiment filter
  const runsOffset = (runsPage - 1) * RUNS_PER_PAGE;
  const {
    attempts: rawAttempts,
    total: runsTotal,
    sentimentStats,
    isLoading: isLoadingAttempts,
    error: attemptsError,
  } = useAttempts({
    interviewId: selectedInterview?.id,
    limit: RUNS_PER_PAGE,
    offset: runsOffset,
    search: runSearch,
    sentiment: sentimentFilter,
    enabled: !!selectedInterview,
  });

  // Calculate total pages for runs (defensive: handle undefined/NaN)
  const runsTotalPages = Math.max(1, Math.ceil((runsTotal || 0) / RUNS_PER_PAGE));

  // Transform attempts to runs (defensive: ensure array)
  const selectedRuns = useMemo(() => {
    if (!rawAttempts || !Array.isArray(rawAttempts)) return [];
    // Filter to only completed runs (status "done")
    const runs = rawAttempts
      .filter((attempt) => attempt.status === "done")
      .map(transformAttemptToRun);

    return runs;
  }, [rawAttempts]);

  // Show toast on errors
  useEffect(() => {
    if (interviewsError) {
      toast({
        variant: "destructive",
        title: "Failed to load interviews",
        description: interviewsError.message,
      });
    }
  }, [interviewsError, toast]);

  useEffect(() => {
    if (attemptsError) {
      toast({
        variant: "destructive",
        title: "Failed to load responses",
        description: attemptsError.message,
      });
    }
  }, [attemptsError, toast]);

  const handleInterviewSelect = (interview: InterviewTemplate) => {
    setSelectedInterview(interview);
    setSelectedMockInterview(null);
    setRunSearch("");
    setSentimentFilter("all");
    setRunsPage(1);
  };

  // Reset runs page when search or sentiment filter changes
  const handleRunSearchChange = (value: string) => {
    setRunSearch(value);
    setRunsPage(1);
  };

  const handleSentimentFilterChange = (filter: SentimentFilter) => {
    setSentimentFilter(filter);
    setRunsPage(1);
  };

  // Runs pagination handlers
  const handlePreviousRunsPage = () => {
    setRunsPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextRunsPage = () => {
    setRunsPage((prev) => Math.min(runsTotalPages, prev + 1));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-8">
        <div className="section-container">
          {/* Page Header */}
          <motion.div
            id="dashboard-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Conducted Interviews</h1>
            <p className="text-muted-foreground mt-1">View responses from all your completed interview sessions</p>
          </motion.div>

          {/* Mobile Layout */}
          {isMobile ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              {/* Mobile interview selector */}
              <MobileInterviewSelector
                interviews={allFilteredInterviews}
                selectedInterview={selectedInterview}
                onSelectInterview={handleInterviewSelect}
                searchQuery={interviewSearch}
                onSearchChange={(value) => {
                  setInterviewSearch(value);
                  setCurrentPage(1);
                }}
                isLoading={isLoadingInterviews}
              />

              {/* Search runs */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search participants..."
                  value={runSearch}
                  onChange={(e) => handleRunSearchChange(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Sentiment filter - Mobile */}
              <div className="flex gap-2">
                {(["all", "positive", "neutral", "negative"] as SentimentFilter[]).map((sentiment) => (
                  <Button
                    key={sentiment}
                    variant={sentimentFilter === sentiment ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSentimentFilterChange(sentiment)}
                    className="h-9 capitalize"
                  >
                    {sentiment}
                  </Button>
                ))}
              </div>

              {/* Sentiment Distribution - Mobile */}
              {/* Hidden when sentiment filter is active */}
              {selectedInterview && !isLoadingAttempts && selectedRuns.length > 0 && sentimentFilter === "all" && sentimentStats && (
                <SentimentDistribution
                  data={{
                    positive: Math.round(sentimentStats.positive_percent),
                    neutral: Math.round(sentimentStats.neutral_percent),
                    negative: Math.round(sentimentStats.negative_percent),
                  }}
                />
              )}

              {/* Runs list */}
              <div className="space-y-3">
                <AnimatePresence mode="wait">
                  {isLoadingAttempts ? (
                    <LoadingRunsState />
                  ) : selectedRuns.length > 0 ? (
                    selectedRuns.map((run, index) => <ConductedRunCard key={run.id} run={run} index={index} />)
                  ) : allFilteredInterviews.length === 0 ? (
                    <EmptyInterviewsState />
                  ) : (
                    <EmptyRunsState />
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Runs Pagination */}
              {!isLoadingAttempts && selectedRuns.length > 0 && runsTotalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousRunsPage}
                    disabled={runsPage === 1}
                    className="h-8 px-3"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Prev
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {runsPage} of {runsTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextRunsPage}
                    disabled={runsPage === runsTotalPages}
                    className="h-8 px-3"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            /* Desktop Layout - Master-Detail */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex gap-6"
            >
              {/* Left Column - Interview List - Fixed width, min height fits 10 items */}
              <div id="interview-list" className="w-[360px] flex-shrink-0 flex-grow-0">
                <div className="bg-card border border-border rounded-2xl p-4 min-h-[750px]">
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search interviews..."
                      value={interviewSearch}
                      onChange={(e) => {
                        setInterviewSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-9"
                    />
                  </div>

                  {/* Mock Analytics Interviews */}
                  {!isLoadingInterviews && (
                    <div className="space-y-2 mb-3">
                      {mockAnalyticsInterviews.map((mi) => (
                        <motion.button
                          key={mi.id}
                          onClick={() => {
                            setSelectedMockInterview(mi);
                            setSelectedInterview(null);
                          }}
                          className={cn(
                            "w-full text-left p-4 rounded-xl border transition-all duration-200",
                            selectedMockInterview?.id === mi.id
                              ? "bg-primary/5 border-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.3)]"
                              : "border-primary/20 bg-primary/5 hover:bg-primary/10"
                          )}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                              selectedMockInterview?.id === mi.id ? "bg-primary/10" : "bg-primary/10"
                            )}>
                              <BarChart3 className={cn(
                                "w-4 h-4",
                                selectedMockInterview?.id === mi.id ? "text-primary" : "text-primary"
                              )} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm leading-tight truncate text-foreground">
                                {mi.title}
                              </h3>
                              <span className="text-xs text-muted-foreground capitalize">
                                {mi.type.replace(/_/g, " ")} • {mi.participants.length} participants
                              </span>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Interview list */}
                  <div className="space-y-2 mb-4">
                      {isLoadingInterviews ? (
                        // Loading skeletons
                        Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="p-4 rounded-xl border border-border bg-card">
                            <div className="flex items-start gap-3">
                              <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <div className="flex gap-3">
                                  <Skeleton className="h-3 w-20" />
                                  <Skeleton className="h-3 w-16" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : paginatedInterviews.length > 0 ? (
                        paginatedInterviews.map((interview) => (
                          <InterviewListItem
                            key={interview.id}
                            interview={interview}
                            isSelected={selectedInterview?.id === interview.id}
                            onClick={() => handleInterviewSelect(interview)}
                          />
                        ))
                      ) : interviewsError ? (
                        <div className="text-center py-8">
                          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Failed to load interviews</p>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                          No interviews with completed responses
                        </div>
                      )}
                  </div>

                  {/* Pagination */}
                  {!isLoadingInterviews && totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="h-8 px-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {currentPage} / {totalPages}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="h-8 px-2"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Runs Detail */}
              <div id="runs-detail" className="flex-1 min-w-0">
                {selectedMockInterview ? (
                  /* Mock Analytics Interview Detail - matching runs layout */
                  <>
                    {/* Header with title and overview button */}
                    <div className="flex flex-col gap-3 mb-4">
                      <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-foreground truncate">
                          {selectedMockInterview.title}
                        </h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto gap-1.5 text-xs text-muted-foreground hover:text-foreground flex-shrink-0"
                          onClick={() => navigate(`/dashboard/interview/${selectedMockInterview.id}`)}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Interview Overview
                        </Button>
                      </div>
                    </div>

                    {/* Runs list using ConductedRunCard */}
                    <div className="flex-1">
                      <motion.div
                        key={selectedMockInterview.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                      >
                        {getMockAnalyticsRuns(selectedMockInterview.id).map((run, index) => (
                          <motion.div
                            key={run.id}
                            className="cursor-pointer"
                            onClick={() => {
                              const participant = selectedMockInterview.participants.find(
                                (p) => p.email === run.participantEmail
                              );
                              if (participant) {
                                navigate(`/dashboard/interview/${selectedMockInterview.id}/candidate/${participant.id}`);
                              }
                            }}
                          >
                            <ConductedRunCard run={run} index={index} />
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </>
                ) : (
                  /* Real Interview Runs Detail */
                  <>
                    {/* Header with search and sentiment filter */}
                    <div className="flex flex-col gap-3 mb-4">
                      <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-foreground truncate">
                          {selectedInterview?.title || "Select an interview"}
                        </h2>
                        <div className="flex-1 max-w-xs ml-auto">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder="Search participants..."
                              value={runSearch}
                              onChange={(e) => handleRunSearchChange(e.target.value)}
                              className="pl-9"
                              disabled={!selectedInterview}
                            />
                          </div>
                        </div>
                      </div>
                      {/* Sentiment filter */}
                      <div className="flex gap-2">
                        {(["all", "positive", "neutral", "negative"] as SentimentFilter[]).map((sentiment) => (
                          <Button
                            key={sentiment}
                            variant={sentimentFilter === sentiment ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSentimentFilterChange(sentiment)}
                            className="h-8 capitalize"
                            disabled={!selectedInterview}
                          >
                            {sentiment}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Sentiment Distribution */}
                    {selectedInterview && !isLoadingAttempts && selectedRuns.length > 0 && sentimentFilter === "all" && sentimentStats && (
                      <SentimentDistribution
                        className="mb-4"
                        data={{
                          positive: Math.round(sentimentStats.positive_percent),
                          neutral: Math.round(sentimentStats.neutral_percent),
                          negative: Math.round(sentimentStats.negative_percent),
                        }}
                      />
                    )}

                    {/* Runs list */}
                    <div className="flex-1">
                      <AnimatePresence mode="wait">
                        {isLoadingInterviews ? (
                          <LoadingRunsState key="loading-interviews" />
                        ) : allFilteredInterviews.length === 0 ? (
                          <EmptyInterviewsState key="empty-interviews" />
                        ) : isLoadingAttempts ? (
                          <LoadingRunsState key="loading-attempts" />
                        ) : selectedRuns.length > 0 ? (
                          <motion.div
                            key={`${selectedInterview?.id}-${runsPage}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3"
                          >
                            {selectedRuns.map((run, index) => (
                              <ConductedRunCard key={run.id} run={run} index={index} />
                            ))}
                          </motion.div>
                        ) : attemptsError ? (
                          <ErrorState key="error" message="Failed to load responses" />
                        ) : (
                          <EmptyRunsState key="empty-runs" />
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Runs pagination */}
                    {!isLoadingAttempts && !isLoadingInterviews && allFilteredInterviews.length > 0 && runsTotalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handlePreviousRunsPage}
                          disabled={runsPage === 1}
                          className="h-8 px-2"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Prev
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          Page {runsPage} of {runsTotalPages}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleNextRunsPage}
                          disabled={runsPage === runsTotalPages}
                          className="h-8 px-2"
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>


      <Footer />
    </div>
  );
};

// Empty state for runs
const EmptyRunsState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-16 text-center"
  >
    <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mb-4">
      <Inbox className="w-7 h-7 text-muted-foreground" />
    </div>
    <h3 className="text-base font-medium text-foreground mb-1">No responses yet</h3>
    <p className="text-sm text-muted-foreground max-w-xs">
      When participants complete this interview, their responses will appear here.
    </p>
  </motion.div>
);

// Empty state when no interviews with completed responses
const EmptyInterviewsState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-16 text-center"
  >
    <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mb-4">
      <Inbox className="w-7 h-7 text-muted-foreground" />
    </div>
    <h3 className="text-base font-medium text-foreground mb-1">No completed interviews</h3>
    <p className="text-sm text-muted-foreground max-w-xs">
      When participants complete your interviews, they will appear here.
    </p>
  </motion.div>
);

// Loading state for runs
const LoadingRunsState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-3 pb-4"
  >
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="p-4 bg-card border border-border rounded-xl">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="space-y-2 mb-3">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    ))}
  </motion.div>
);

// Error state
const ErrorState = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-16 text-center"
  >
    <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
      <AlertCircle className="w-7 h-7 text-destructive" />
    </div>
    <h3 className="text-base font-medium text-foreground mb-1">Something went wrong</h3>
    <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
  </motion.div>
);

export default DashboardV2;
