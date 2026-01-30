import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import InterviewListItem from "@/components/dashboard-v2/InterviewListItem";
import ConductedRunCard from "@/components/dashboard-v2/ConductedRunCard";
import MobileInterviewSelector from "@/components/dashboard-v2/MobileInterviewSelector";
import { mockInterviewTemplates, getRunsForInterview, InterviewTemplate } from "@/lib/mockDashboardV2Data";
import { useIsMobile } from "@/hooks/use-mobile";

const INTERVIEWS_PER_PAGE = 15;

const DashboardV2 = () => {
  const isMobile = useIsMobile();

  // State
  const [selectedInterview, setSelectedInterview] = useState<InterviewTemplate | null>(
    mockInterviewTemplates[0] || null,
  );
  const [interviewSearch, setInterviewSearch] = useState("");
  const [runSearch, setRunSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter interviews by search
  const filteredInterviews = useMemo(() => {
    if (!interviewSearch.trim()) return mockInterviewTemplates;
    const query = interviewSearch.toLowerCase();
    return mockInterviewTemplates.filter((interview) => interview.title.toLowerCase().includes(query));
  }, [interviewSearch]);

  // Pagination for interviews
  const totalPages = Math.max(1, Math.ceil(filteredInterviews.length / INTERVIEWS_PER_PAGE));
  const paginatedInterviews = useMemo(() => {
    const start = (currentPage - 1) * INTERVIEWS_PER_PAGE;
    return filteredInterviews.slice(start, start + INTERVIEWS_PER_PAGE);
  }, [filteredInterviews, currentPage]);

  // Get runs for selected interview
  const selectedRuns = useMemo(() => {
    if (!selectedInterview) return [];
    const runs = getRunsForInterview(selectedInterview.id);
    if (!runSearch.trim()) return runs;
    const query = runSearch.toLowerCase();
    return runs.filter(
      (run) =>
        run.participantFirstName.toLowerCase().includes(query) ||
        run.participantLastName.toLowerCase().includes(query) ||
        run.participantEmail.toLowerCase().includes(query),
    );
  }, [selectedInterview, runSearch]);

  const handleInterviewSelect = (interview: InterviewTemplate) => {
    setSelectedInterview(interview);
    setRunSearch("");
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
                interviews={filteredInterviews}
                selectedInterview={selectedInterview}
                onSelectInterview={handleInterviewSelect}
                searchQuery={interviewSearch}
                onSearchChange={setInterviewSearch}
              />

              {/* Search runs */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search participants..."
                  value={runSearch}
                  onChange={(e) => setRunSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Runs list */}
              <div className="space-y-3">
                <AnimatePresence mode="wait">
                  {selectedRuns.length > 0 ? (
                    selectedRuns.map((run, index) => <ConductedRunCard key={run.id} run={run} index={index} />)
                  ) : (
                    <EmptyRunsState />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            /* Desktop Layout - Master-Detail */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex gap-6 min-h-[calc(100vh-220px)]"
            >
              {/* Left Column - Interview List */}
              <div id="interview-list" className="w-[340px] flex-shrink-0 flex flex-col">
                <div className="bg-card border border-border rounded-2xl p-4 flex flex-col h-full">
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

                  {/* Interview list */}
                  <ScrollArea className="flex-1 -mx-2 px-2">
                    <div className="space-y-2">
                      {paginatedInterviews.map((interview) => (
                        <InterviewListItem
                          key={interview.id}
                          interview={interview}
                          isSelected={selectedInterview?.id === interview.id}
                          onClick={() => handleInterviewSelect(interview)}
                        />
                      ))}
                      {paginatedInterviews.length === 0 && (
                        <div className="text-center py-8 text-sm text-muted-foreground">No interviews found</div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
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
              <div id="runs-detail" className="flex-1 flex flex-col min-w-0">
                {/* Header with search */}
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-lg font-semibold text-foreground truncate">
                    {selectedInterview?.title || "Select an interview"}
                  </h2>
                  <div className="flex-1 max-w-xs ml-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search participants..."
                        value={runSearch}
                        onChange={(e) => setRunSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                {/* Runs list - scrollable */}
                <ScrollArea className="flex-1 -mx-1 px-1">
                  <AnimatePresence mode="wait">
                    {selectedRuns.length > 0 ? (
                      <motion.div
                        key={selectedInterview?.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3 pb-4"
                      >
                        {selectedRuns.map((run, index) => (
                          <ConductedRunCard key={run.id} run={run} index={index} />
                        ))}
                      </motion.div>
                    ) : (
                      <EmptyRunsState />
                    )}
                  </AnimatePresence>
                </ScrollArea>
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

export default DashboardV2;
