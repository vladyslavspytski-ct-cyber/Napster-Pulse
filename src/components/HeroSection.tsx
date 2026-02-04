import { ArrowRight, Play, Mic, BarChart3, Users, TrendingUp, MessageSquare, Check, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onCreateInterview?: () => void;
}

const HeroSection = ({ onCreateInterview }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen hero-gradient overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-interu-blue/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-interu-coral/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-interu-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-interu-blue-light border border-primary/20 mb-6">
              <Mic className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Voice-Powered Interviews</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Create and participate in{" "}
              <span className="text-primary">voice-based</span>{" "}
              interviews
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Easy, fast, and insightful. Transform your interview process with AI-powered voice interactions and sentiment analysis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <PrimaryButton 
                size="lg" 
                className="text-base h-12 px-8 group"
                onClick={onCreateInterview}
              >
                Create Interview
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </PrimaryButton>
              <SecondaryButton size="lg" className="text-base h-12 px-8 group">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </SecondaryButton>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start">
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-foreground">10k+</p>
                <p className="text-sm text-muted-foreground">Interviews Created</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-foreground">98%</p>
                <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-foreground">5min</p>
                <p className="text-sm text-muted-foreground">Avg. Setup Time</p>
              </div>
            </div>
          </div>

          {/* Right Content - Create Interview Preview */}
          <motion.div 
            className="relative animate-fade-up" 
            style={{ animationDelay: "0.2s" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              {/* Main Card - Create Interview Preview */}
              <div className="glass-card rounded-3xl p-6 shadow-card-hover">
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Create Interview</h3>
                  <p className="text-sm text-muted-foreground">Set up your voice interview in minutes</p>
                </div>

                {/* Interview Name Input Preview */}
                <div className="mb-5">
                  <label className="text-sm font-medium text-foreground mb-2 block">Interview Name</label>
                  <div className="h-10 rounded-lg bg-muted/50 border border-border px-3 flex items-center">
                    <span className="text-sm text-muted-foreground">Product Manager Interview — Q1 2026</span>
                  </div>
                </div>

                {/* Voice Assistant Preview */}
                <div className="mb-5 p-4 rounded-2xl bg-interu-blue-light/50 border border-primary/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <Mic className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Voice Assistant</p>
                      <p className="text-xs text-primary">Ready to record</p>
                    </div>
                  </div>
                  <div className="flex gap-1 h-6 items-end justify-center">
                    {[0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.3, 0.7, 0.5].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-primary/60 rounded-full"
                        initial={{ height: 4 }}
                        animate={{ height: h * 24 }}
                        transition={{ 
                          duration: 0.5, 
                          repeat: Infinity, 
                          repeatType: "reverse",
                          delay: i * 0.1 
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Questions Preview */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Questions</label>
                  {[
                    "What is your experience with product management?",
                    "Describe a challenging project you led.",
                    "How do you prioritize features?"
                  ].map((q, i) => (
                    <div 
                      key={i}
                      className="p-3 rounded-xl bg-muted/30 border border-border flex items-center gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-interu-mint-light flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-interu-mint" />
                      </div>
                      <span className="text-sm text-foreground truncate">{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Card - Participant Form Preview */}
              <motion.div 
                className="absolute -top-4 -right-4 glass-card rounded-2xl p-4 shadow-card hidden lg:block"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-interu-coral-light flex items-center justify-center">
                    <User className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Participant</span>
                </div>
                <div className="space-y-2 w-36">
                  <div className="h-6 rounded bg-muted/60 px-2 flex items-center">
                    <span className="text-xs text-muted-foreground">John Doe</span>
                  </div>
                  <div className="h-6 rounded bg-muted/60 px-2 flex items-center">
                    <span className="text-xs text-muted-foreground">john@company.com</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card - Interview Active */}
              <motion.div 
                className="absolute -bottom-4 -left-4 glass-card rounded-2xl p-4 shadow-card hidden lg:block"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-interu-mint-light flex items-center justify-center">
                    <Mic className="w-5 h-5 text-interu-mint" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Interview Active</p>
                    <p className="text-xs text-interu-mint">Recording in progress...</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
