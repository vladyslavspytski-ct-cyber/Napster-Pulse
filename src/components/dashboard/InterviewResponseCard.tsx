import { motion } from "framer-motion";
import { User, Mail, Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  InterviewResponse,
  extractSentiment,
  getSummary,
} from "@/lib/mockDashboardData";
import { format } from "date-fns";

interface InterviewResponseCardProps {
  response: InterviewResponse;
  index?: number;
}

const getSentimentVariant = (label: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (label.toLowerCase()) {
    case "positive":
      return "default";
    case "negative":
      return "destructive";
    case "neutral":
    case "mixed":
      return "secondary";
    default:
      return "outline";
  }
};

const getStatusVariant = (status: string, successful: boolean): "default" | "secondary" | "destructive" | "outline" => {
  if (!successful || status === "failed") return "destructive";
  if (status === "completed") return "default";
  return "secondary";
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const InterviewResponseCard = ({ response, index = 0 }: InterviewResponseCardProps) => {
  const sentiment = extractSentiment(response.analysis);
  const summary = getSummary(response);
  const title = response.interview_title || response.call_summary_title || "Interview Response";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="glass-card border-border/50 hover:border-border/80 transition-colors">
        <CardContent className="p-5 space-y-4">
          {/* Header: Title + Status badges */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <h3 className="text-lg font-semibold text-foreground leading-tight">
              {title}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant={getStatusVariant(response.status, response.call_successful)}>
                {response.call_successful ? "Completed" : response.status}
              </Badge>
              {sentiment.label && sentiment.label !== "unknown" && (
                <Badge variant={getSentimentVariant(sentiment.label)}>
                  {sentiment.label}
                  {sentiment.score !== undefined && ` (${(sentiment.score * 100).toFixed(0)}%)`}
                </Badge>
              )}
            </div>
          </div>

          {/* Participant info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>
                {response.participant_first_name} {response.participant_last_name}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              <span className="truncate max-w-[200px]">{response.participant_email}</span>
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
              {summary}
            </p>
          )}

          {/* Footer: Date/time + Duration */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground pt-2 border-t border-border/30">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {format(new Date(response.started_at), "MMM d, yyyy 'at' HH:mm")}
              </span>
              <span className="text-muted-foreground/60">(Europe/Berlin)</span>
            </div>
            {response.call_duration_secs > 0 && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatDuration(response.call_duration_secs)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InterviewResponseCard;
