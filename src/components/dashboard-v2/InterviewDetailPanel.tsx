import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Mail, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { AnalyticsInterview } from "@/lib/mockAnalyticsData";

interface InterviewDetailPanelProps {
  interview: AnalyticsInterview | null;
  onClose: () => void;
}

const InterviewDetailPanel = ({ interview, onClose }: InterviewDetailPanelProps) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {interview && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-background border-l border-border shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex-shrink-0 border-b border-border p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-foreground leading-tight truncate">
                    {interview.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="secondary" className="text-xs font-medium capitalize">
                      {interview.type.replace(/_/g, " ")}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {interview.participants.length}{" "}
                      {interview.participants.length === 1 ? "participant" : "participants"}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 h-8 w-8 rounded-lg"
                  onClick={onClose}
                >
                  <X className="w-4 h-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>

              {/* View Full Analytics */}
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full gap-2"
                onClick={() => {
                  onClose();
                  navigate(`/dashboard/interview/${interview.id}`);
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Interview Overview
              </Button>
            </div>

            {/* Participants List */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Participants
                </h3>
                {interview.participants.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "group rounded-xl border border-border bg-card p-4",
                      "hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-foreground truncate">{p.name}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{p.email}</span>
                        </div>
                      </div>
                      {/* Composite Score */}
                      <div className="flex-shrink-0 text-right">
                        <div className="text-lg font-bold text-foreground leading-none">
                          {p.compositeScore}
                        </div>
                        <span className="text-[10px] text-muted-foreground">/ 10</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3 w-full h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        onClose();
                        navigate(`/dashboard/interview/${interview.id}/candidate/${p.id}`);
                      }}
                    >
                      View Profile
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InterviewDetailPanel;
