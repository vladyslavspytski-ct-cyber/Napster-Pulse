import { motion } from "framer-motion";
import { FileText, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { InterviewTemplate, formatDate } from "@/lib/mockDashboardV2Data";

interface InterviewListItemProps {
  interview: InterviewTemplate;
  isSelected: boolean;
  onClick: () => void;
}

const InterviewListItem = ({
  interview,
  isSelected,
  onClick,
}: InterviewListItemProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-xl border transition-all duration-200",
        "hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        isSelected
          ? "bg-primary/5 border-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.3)]"
          : "bg-card border-border hover:border-border/80"
      )}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
            isSelected ? "bg-primary/10" : "bg-muted"
          )}
        >
          <FileText
            className={cn(
              "w-4 h-4",
              isSelected ? "text-primary" : "text-muted-foreground"
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-medium text-sm leading-tight truncate",
              isSelected ? "text-primary" : "text-foreground"
            )}
          >
            {interview.title}
          </h3>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs text-muted-foreground">
              {formatDate(interview.createdAt)}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>
                {interview.completedCount}{" "}
                {interview.completedCount === 1 ? "response" : "responses"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default InterviewListItem;
