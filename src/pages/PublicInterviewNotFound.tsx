import { motion } from "framer-motion";
import { Link2Off, MicOff, Home, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Button } from "@/components/ui/button";

// UI-only placeholder constant (no routing logic)
const keyPreview = "ba9a4bf6...";

const PublicInterviewNotFound = () => {
  // TODO: Wire up actual navigation logic
  const handleGoHome = () => {
    // TODO: Navigate to home page
  };

  // TODO: Wire up actual close tab logic
  const handleCloseTab = () => {
    // TODO: Close the browser tab
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 hero-gradient opacity-50" />

      <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-lg mx-auto"
          >
            {/* Glass Card Container */}
            <Card className="glass-card shadow-card border-border/50 overflow-hidden">
              <CardHeader className="text-center pb-2 pt-8">
                {/* Decorative Illustration */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mx-auto mb-6"
                >
                  <div className="relative w-24 h-24 mx-auto">
                    {/* Pastel gradient circle background */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 via-accent/10 to-secondary opacity-60" />
                    
                    {/* SVG Illustration: Broken link / microphone off */}
                    <svg
                      viewBox="0 0 96 96"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="relative w-full h-full"
                    >
                      {/* Outer circle */}
                      <circle
                        cx="48"
                        cy="48"
                        r="44"
                        stroke="hsl(var(--primary))"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        opacity="0.3"
                      />
                      
                      {/* Microphone body */}
                      <rect
                        x="38"
                        y="24"
                        width="20"
                        height="32"
                        rx="10"
                        fill="hsl(var(--primary))"
                        opacity="0.15"
                        stroke="hsl(var(--primary))"
                        strokeWidth="1.5"
                      />
                      
                      {/* Microphone stand arc */}
                      <path
                        d="M32 48 C32 60 40 68 48 68 C56 68 64 60 64 48"
                        stroke="hsl(var(--primary))"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.4"
                      />
                      
                      {/* Microphone stand */}
                      <line
                        x1="48"
                        y1="68"
                        x2="48"
                        y2="76"
                        stroke="hsl(var(--primary))"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.4"
                      />
                      
                      {/* Stand base */}
                      <line
                        x1="40"
                        y1="76"
                        x2="56"
                        y2="76"
                        stroke="hsl(var(--primary))"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.4"
                      />
                      
                      {/* Diagonal "off" line */}
                      <line
                        x1="28"
                        y1="72"
                        x2="68"
                        y2="28"
                        stroke="hsl(var(--accent))"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity="0.8"
                      />
                      
                      {/* Broken link indicator - small chain links */}
                      <circle
                        cx="30"
                        cy="30"
                        r="4"
                        stroke="hsl(var(--muted-foreground))"
                        strokeWidth="1.5"
                        fill="none"
                        opacity="0.5"
                      />
                      <circle
                        cx="66"
                        cy="66"
                        r="4"
                        stroke="hsl(var(--muted-foreground))"
                        strokeWidth="1.5"
                        fill="none"
                        opacity="0.5"
                      />
                    </svg>
                  </div>
                </motion.div>

                <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                  Interview not found
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground mt-2">
                  This interview link is invalid or the interview was deleted.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4 pb-8 px-6 md:px-8">
                {/* Interview key chip */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-center mb-6"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                    <Link2Off className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-mono text-muted-foreground">
                      Interview: {keyPreview}
                    </span>
                  </div>
                </motion.div>

                {/* Helpful next steps */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <h4 className="text-sm font-medium text-foreground mb-3">
                    What you can try:
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      Ask the creator to send a new link
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      Check if you copied the full URL
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      If you believe this is a mistake, contact support
                    </li>
                  </ul>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <PrimaryButton
                    onClick={handleGoHome}
                    className="flex-1"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go to Interu Home
                  </PrimaryButton>
                  <Button
                    variant="outline"
                    onClick={handleCloseTab}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Close tab
                  </Button>
                </motion.div>

                {/* Contact support link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center mt-4"
                >
                  <a
                    href="#"
                    className="text-sm text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                  >
                    Contact support
                  </a>
                </motion.div>
              </CardContent>
            </Card>

            {/* Powered by Interu */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-xs text-muted-foreground/60 mt-6"
            >
              Powered by Interu
            </motion.p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PublicInterviewNotFound;
