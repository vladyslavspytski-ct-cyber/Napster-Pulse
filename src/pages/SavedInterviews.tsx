import { useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, FileText, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ElectronPageWrapper from "@/components/electron/ElectronPageWrapper";
import { useIsElectron } from "@/lib/electron";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SavedInterviewListCard from "@/components/saved-interviews/SavedInterviewListCard";
import { SavedInterview, transformToSavedInterview } from "@/lib/mockDashboardData";
import { useInterviews } from "@/hooks/api/useInterviews";
import { useDeleteInterview } from "@/hooks/api/useDeleteInterview";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 10;

const SavedInterviews = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isDesktop = useIsElectron();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [interviewToDelete, setInterviewToDelete] = useState<SavedInterview | null>(null);

  // Debounce search to avoid excessive API calls
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Delete interview hook
  const { deleteInterview, isDeleting } = useDeleteInterview();

  // Fetch interviews from API with server-side pagination
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const { interviews: rawInterviews, total, isLoading, error, refetch } = useInterviews({
    limit: ITEMS_PER_PAGE,
    offset,
    search: debouncedSearch,
  });

  // Transform API data to SavedInterview format (defensive: ensure array)
  const interviews: SavedInterview[] = useMemo(() => {
    if (!rawInterviews || !Array.isArray(rawInterviews)) return [];
    return rawInterviews.map((interview) => transformToSavedInterview(interview));
  }, [rawInterviews]);

  // Calculate total pages from API response (defensive: handle undefined/NaN)
  const totalPages = Math.max(1, Math.ceil((total || 0) / ITEMS_PER_PAGE));

  // Reset page when search changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);

    // Debounce the API call
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    const timeout = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
    debounceTimeoutRef.current = timeout;
  }, []);

  const handleCreateInterview = () => {
    navigate("/create-interview");
  };

  // Handle delete interview
  const handleDeleteClick = useCallback((interview: SavedInterview) => {
    setInterviewToDelete(interview);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!interviewToDelete) return;

    try {
      await deleteInterview(interviewToDelete.id);
      toast({
        title: "Interview deleted",
        description: `"${interviewToDelete.title}" has been deleted.`,
      });
      setInterviewToDelete(null);
      // Refetch the list
      refetch();
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to delete",
        description: "Could not delete the interview. Please try again.",
      });
    }
  }, [interviewToDelete, deleteInterview, toast, refetch]);

  const handleCancelDelete = useCallback(() => {
    setInterviewToDelete(null);
  }, []);

  return (
    <ElectronPageWrapper>
    <div className={`min-h-screen flex flex-col bg-background ${isDesktop ? 'electron-page' : ''}`}>
      {!isDesktop && <Header />}

      <main className={`flex-1 ${isDesktop ? 'pt-6' : 'pt-24'} pb-8`}>
        <div className="section-container">
          {/* Page Header */}
          <motion.div
            id="saved-interviews-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Library
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
            id="saved-interviews-controls"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-6"
          >
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </motion.div>

          {/* Interviews List */}
          <motion.div
            id="saved-interviews-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <LoadingSkeleton key={i} />
                  ))}
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                    <AlertCircle className="w-7 h-7 text-destructive" />
                  </div>
                  <h3 className="text-base font-medium text-foreground mb-1">
                    Failed to load interviews
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mb-4">
                    {error.message}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    <Loader2 className="w-4 h-4 mr-2" />
                    Try again
                  </Button>
                </motion.div>
              ) : interviews.length > 0 ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {interviews.map((interview, index) => (
                    <SavedInterviewListCard
                      key={interview.id}
                      interview={interview}
                      index={index}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  hasFilters={searchQuery.trim() !== ""}
                  onClearFilters={() => {
                    setSearchQuery("");
                    setDebouncedSearch("");
                  }}
                  onCreateInterview={handleCreateInterview}
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <motion.div
              id="saved-interviews-pagination"
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

      {!isDesktop && <Footer />}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!interviewToDelete} onOpenChange={(open) => !open && handleCancelDelete()}>
        <AlertDialogContent className="p-0 gap-0 overflow-hidden sm:max-w-md">
          <div className="p-6">
            <AlertDialogTitle className="text-lg font-semibold">Delete Interview</AlertDialogTitle>
            <AlertDialogDescription className="mt-2">
              Are you sure you want to delete "{interviewToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-6 py-4 border-t bg-muted/30">
            <AlertDialogCancel disabled={isDeleting} className="sm:mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </ElectronPageWrapper>
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

// Loading skeleton component
const LoadingSkeleton = () => (
  <Card className="bg-card border border-border">
    <CardContent className="p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-5 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default SavedInterviews;
