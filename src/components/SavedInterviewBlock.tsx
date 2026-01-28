import { motion } from "framer-motion";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

interface SavedInterviewBlockProps {
  title: string;
  questionsCount: number;
  /** Clean URL displayed to user (without query params) */
  displayUrl: string;
  /** Full URL for copy/open actions (with query params) */
  fullUrl: string;
  onCreateAnother: () => void;
}

const SavedInterviewBlock = ({
  title,
  questionsCount,
  displayUrl,
  fullUrl,
}: SavedInterviewBlockProps) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    toast({
      title: "Link copied!",
      description: "The interview link has been copied to your clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleOpenLink = () => {
    window.open(fullUrl, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="glass-card border-border/50">
        <CardContent className="pt-8 pb-8 space-y-6">
          {/* Success indicator */}
          <div className="flex flex-col items-center text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-foreground">
              Interview saved
            </h2>
          </div>

          {/* Interview details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="space-y-3 bg-background/50 rounded-xl p-4 border border-border/30"
          >
            {title && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Title</span>
                <span className="text-sm font-medium text-foreground">{title}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Questions</span>
              <span className="text-sm font-medium text-foreground">
                {questionsCount} question{questionsCount !== 1 ? "s" : ""}
              </span>
            </div>
          </motion.div>

          {/* Public link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-foreground">
              Public Interview Link
            </label>
            <div className="flex gap-2">
              <Input
                value={displayUrl}
                readOnly
                className="bg-background/50 font-mono text-sm"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="icon"
                className="shrink-0 transition-transform duration-150 active:scale-95"
                title="Copy link"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={handleOpenLink}
                variant="outline"
                size="icon"
                className="shrink-0 transition-transform duration-150 active:scale-95"
                title="Open link"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 pt-2"
          >
            <SecondaryButton
              size="lg"
              className="flex-1 opacity-50 cursor-not-allowed"
              disabled
            >
              Go to Dashboard
            </SecondaryButton>
          </motion.div>

          {/* Helper text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="text-xs text-muted-foreground text-center"
          >
            This interview will appear in Dashboard → Created interviews (coming soon).
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SavedInterviewBlock;
