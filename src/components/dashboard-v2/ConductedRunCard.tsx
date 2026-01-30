import { motion } from "framer-motion";
import { User, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConductedRun, formatDateTime } from "@/lib/mockDashboardV2Data";
import { cn } from "@/lib/utils";

interface ConductedRunCardProps {
  run: ConductedRun;
  index: number;
}

const ConductedRunCard = ({ run, index }: ConductedRunCardProps) => {
  const sentimentConfig = {
    positive: {
      variant: "default" as const,
      className: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100",
    },
    neutral: {
      variant: "secondary" as const,
      className: "bg-muted text-muted-foreground border-border hover:bg-muted",
    },
    negative: {
      variant: "destructive" as const,
      className: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
    },
  };

  const config = sentimentConfig[run.sentimentLabel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="group p-4 bg-card border border-border rounded-xl hover:shadow-sm transition-all duration-200"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-foreground truncate">
              {run.participantFirstName} {run.participantLastName}
            </h4>
            <p className="text-sm text-muted-foreground truncate">
              {run.participantEmail}
            </p>
          </div>
        </div>
        <Badge variant={config.variant} className={cn("flex-shrink-0", config.className)}>
          {run.sentimentLabel}
        </Badge>
      </div>

      {/* Summary */}
      <p className="text-sm text-foreground/80 leading-relaxed mb-3 line-clamp-3">
        {run.summary}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Calendar className="w-3.5 h-3.5" />
        <span>{formatDateTime(run.conductedAt)}</span>
        <span className="text-muted-foreground/50">•</span>
        <Clock className="w-3.5 h-3.5" />
        <span>Local time (Europe/Berlin)</span>
      </div>
    </motion.div>
  );
};

export default ConductedRunCard;
