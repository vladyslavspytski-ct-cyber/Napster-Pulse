import { motion } from "framer-motion";
import { Copy, ExternalLink, FileText, Calendar, Check } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SavedInterview } from "@/lib/mockDashboardData";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface SavedInterviewListCardProps {
  interview: SavedInterview;
  index?: number;
}

const SavedInterviewListCard = ({ interview, index = 0 }: SavedInterviewListCardProps) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(interview.public_url);
    setIsCopied(true);
    toast({
      title: "Link copied!",
      description: "The interview link has been copied to your clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleOpen = () => {
    window.open(interview.public_url, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <Card className="bg-card border border-border hover:border-border/80 transition-all duration-200 hover:shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Left: Title & Meta */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start gap-3">
                <h3 className="text-base font-semibold text-foreground leading-tight truncate">
                  {interview.title}
                </h3>
                <Badge
                  variant={interview.is_active ? "default" : "secondary"}
                  className="shrink-0"
                >
                  {interview.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>
                    {interview.questions_count} question
                    {interview.questions_count !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{format(new Date(interview.created_at), "MMM d, yyyy")}</span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="default"
                size="sm"
                onClick={handleCopyLink}
                className="h-8 px-3"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy link
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleOpen} className="h-8 px-3">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Open
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SavedInterviewListCard;
