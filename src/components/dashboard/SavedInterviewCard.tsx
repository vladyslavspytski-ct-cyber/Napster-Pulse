import { motion } from "framer-motion";
import { Copy, ExternalLink, FileText, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SavedInterview } from "@/lib/mockDashboardData";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface SavedInterviewCardProps {
  interview: SavedInterview;
  index?: number;
}

const SavedInterviewCard = ({ interview, index = 0 }: SavedInterviewCardProps) => {
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(interview.public_url);
    toast({
      title: "Link copied!",
      description: "The interview link has been copied to your clipboard.",
    });
  };

  const handleOpen = () => {
    // UI only - would navigate to interview details
    toast({
      title: "Opening interview",
      description: "This feature is coming soon.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="glass-card border-border/50 hover:border-border/80 transition-colors">
        <CardContent className="p-5 space-y-4">
          {/* Header: Title + Status */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <h3 className="text-lg font-semibold text-foreground leading-tight">
              {interview.title}
            </h3>
            <Badge variant={interview.is_active ? "default" : "secondary"}>
              {interview.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Info row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>
                {interview.questions_count} question{interview.questions_count !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(interview.created_at), "MMM d, yyyy")}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={handleCopyLink}
            >
              <Copy className="w-4 h-4 mr-1.5" />
              Copy link
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={handleOpen}
            >
              <ExternalLink className="w-4 h-4 mr-1.5" />
              Open
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SavedInterviewCard;
