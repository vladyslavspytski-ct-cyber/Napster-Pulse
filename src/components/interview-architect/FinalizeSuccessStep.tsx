import { motion } from "framer-motion";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useIsElectron, WEB_BASE_URL, WEB_PREVIEW_TOKEN } from "@/lib/electron";

interface FinalizeSuccessStepProps {
  savedData: {
    title: string;
    questionsCount: number;
    publicUrl: string;
  };
  onClose: () => void;
  /** Called when user clicks Done - use for cleanup (clear draft, reset state, etc.) */
  onDone?: () => void;
}

const FinalizeSuccessStep = ({ savedData, onClose, onDone }: FinalizeSuccessStepProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isDesktop = useIsElectron();

  // In Electron, publicUrl might be file:// based - use WEB_BASE_URL instead
  // TODO: Remove token when production domain is ready
  const getWebUrl = () => {
    if (isDesktop) {
      // Extract path from publicUrl (e.g., "/i/abc123" from "file:///i/abc123")
      const path = savedData.publicUrl.replace(/^(file:\/\/|https?:\/\/[^/]+)/, '');
      return `${WEB_BASE_URL}${path}?__lovable_token=${WEB_PREVIEW_TOKEN}`;
    }
    return savedData.publicUrl;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getWebUrl());
    toast({
      title: "Link copied",
      description: "Interview link copied to clipboard",
    });
  };

  const handleOpenLink = () => {
    const url = getWebUrl();
    // window.open with _blank will open in system browser in Electron
    window.open(url, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col h-full"
    >
      {/* Success icon + heading */}
      <div className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
        >
          <Check className="w-8 h-8 text-primary" />
        </motion.div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Interview Created!</h2>
        <p className="text-sm text-muted-foreground">
          "{savedData.title}" with {savedData.questionsCount} questions
        </p>
      </div>

      {/* Share link */}
      <div className="px-8 pb-6">
        <Label className="text-sm text-muted-foreground mb-2 block">
          Share this link with candidates
        </Label>
        <div className="flex gap-2">
          <Input value={getWebUrl()} readOnly className="flex-1 text-sm rounded-xl" />
          <Button size="icon" variant="outline" onClick={handleCopyLink} className="rounded-xl">
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={handleOpenLink}
            className="rounded-xl"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Footer - sticky at bottom on mobile */}
      <div className="p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6 border-t border-border mt-auto bg-card/95">
        <PrimaryButton
          className="w-full"
          onClick={() => {
            // Cleanup draft and reset state before navigating
            onDone?.();
            onClose();
            navigate("/saved-interviews");
          }}
        >
          Done
        </PrimaryButton>
      </div>
    </motion.div>
  );
};

export default FinalizeSuccessStep;
