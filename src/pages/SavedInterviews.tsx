import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import SavedInterviewListCard from "@/components/saved-interviews/SavedInterviewListCard";
import { mockSavedInterviews, SavedInterview } from "@/lib/mockDashboardData";

const ITEMS_PER_PAGE = 10;

type StatusFilter = "all" | "active" | "inactive";

const SavedInterviews = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter interviews
  const filteredInterviews = useMemo(() => {
    let result = mockSavedInterviews;

    // Filter by status
    if (statusFilter === "active") {
      result = result.filter((i) => i.is_active);
    } else if (statusFilter === "inactive") {
      result = result.filter((i) => !i.is_active);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((i) => i.title.toLowerCase().includes(query));
    }

    return result;
  }, [searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredInterviews.length / ITEMS_PER_PAGE));
  const paginatedInterviews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredInterviews.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredInterviews, currentPage]);

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: StatusFilter) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleCreateInterview = () => {
    // UI only - would navigate to create interview page
    window.location.href = "/create-interview";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-8">
        <div className="section-container">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Saved Interviews
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your interview templates and share links
                </p>
              </div>
              <PrimaryButton onClick={handleCreateInterview} className="shrink-0">
                <Plus className="w-4 h-4 mr-2" />
                Create interview
              </PrimaryButton>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status filter */}
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusChange("all")}
                className="h-10"
              >
                All
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusChange("active")}
                className="h-10"
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "inactive" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusChange("inactive")}
                className="h-10"
              >
                Inactive
              </Button>
            </div>
          </motion.div>

          {/* Interviews List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <AnimatePresence mode="wait">
              {paginatedInterviews.length > 0 ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {paginatedInterviews.map((interview, index) => (
                    <SavedInterviewListCard
                      key={interview.id}
                      interview={interview}
                      index={index}
                    />
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  hasFilters={searchQuery.trim() !== "" || statusFilter !== "all"}
                  onClearFilters={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                  onCreateInterview={handleCreateInterview}
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {filteredInterviews.length > ITEMS_PER_PAGE && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between mt-6 pt-6 border-t border-border"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Empty state component
interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  onCreateInterview: () => void;
}

const EmptyState = ({ hasFilters, onClearFilters, onCreateInterview }: EmptyStateProps) => (
  <motion.div
    key="empty"
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.98 }}
    className="flex flex-col items-center justify-center py-16 text-center"
  >
    <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mb-4">
      <FileText className="w-7 h-7 text-muted-foreground" />
    </div>
    <h3 className="text-base font-medium text-foreground mb-1">
      {hasFilters ? "No interviews found" : "No saved interviews yet"}
    </h3>
    <p className="text-sm text-muted-foreground max-w-xs mb-4">
      {hasFilters
        ? "Try adjusting your search or filter criteria."
        : "Create your first interview to get started with AI-powered conversations."}
    </p>
    {hasFilters ? (
      <Button variant="outline" size="sm" onClick={onClearFilters}>
        Clear filters
      </Button>
    ) : (
      <PrimaryButton size="sm" onClick={onCreateInterview}>
        <Plus className="w-4 h-4 mr-2" />
        Create interview
      </PrimaryButton>
    )}
  </motion.div>
);

export default SavedInterviews;
