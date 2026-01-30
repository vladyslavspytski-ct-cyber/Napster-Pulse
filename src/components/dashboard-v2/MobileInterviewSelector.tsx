import { useState } from "react";
import { ChevronDown, FileText, Users, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { InterviewTemplate, formatDate } from "@/lib/mockDashboardV2Data";
import { cn } from "@/lib/utils";

interface MobileInterviewSelectorProps {
  interviews: InterviewTemplate[];
  selectedInterview: InterviewTemplate | null;
  onSelectInterview: (interview: InterviewTemplate) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
}

const MobileInterviewSelector = ({
  interviews,
  selectedInterview,
  onSelectInterview,
  searchQuery,
  onSearchChange,
  isLoading = false,
}: MobileInterviewSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (interview: InterviewTemplate) => {
    onSelectInterview(interview);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="w-full flex items-center justify-between gap-3 p-4 bg-card border border-border rounded-xl text-left hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <FileText className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ) : (
                <>
                  <p className="font-medium text-foreground truncate">
                    {selectedInterview?.title || "Select interview"}
                  </p>
                  {selectedInterview && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Users className="w-3 h-3" />
                      <span>{selectedInterview.completedCount} responses</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
        <SheetHeader className="pb-4">
          <SheetTitle>Select Interview</SheetTitle>
        </SheetHeader>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search interviews..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Interview list */}
        <div className="overflow-y-auto max-h-[calc(80vh-140px)] space-y-2">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-3">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <AnimatePresence>
              {interviews.map((interview, index) => (
                <motion.button
                  key={interview.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => handleSelect(interview)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                    selectedInterview?.id === interview.id
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted"
                  )}
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {interview.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span>{formatDate(interview.createdAt)}</span>
                      <span>{interview.completedCount} responses</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          )}

          {!isLoading && interviews.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No interviews with completed responses
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileInterviewSelector;
