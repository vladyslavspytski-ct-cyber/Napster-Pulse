import { ArrowRight, Play, Mic, BarChart3, Users, TrendingUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

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
              <Button 
                size="lg" 
                className="btn-gradient border-0 text-base h-12 px-8 group"
                onClick={onCreateInterview}
              >
                Create Interview
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="text-base h-12 px-8 group">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
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

          {/* Right Content - Mock Dashboard */}
          <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              {/* Main Dashboard Card */}
              <div className="glass-card rounded-3xl p-6 shadow-card-hover">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Interview Results</h3>
                    <p className="text-sm text-muted-foreground">Product Manager Position</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-interu-mint-light">
                    <div className="w-2 h-2 rounded-full bg-interu-mint" />
                    <span className="text-xs font-medium text-interu-mint">Completed</span>
                  </div>
                </div>

                {/* Sentiment Analysis Preview */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-interu-blue-light">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-primary">Positive</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">78%</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">Neutral</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">18%</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-interu-coral-light">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-accent" />
                      <span className="text-xs font-medium text-accent">Negative</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">4%</p>
                  </div>
                </div>

                {/* Participants Preview */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
                      <Users className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">12 Participants</p>
                      <p className="text-xs text-muted-foreground">8 completed, 4 pending</p>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary">
                    View All
                  </Button>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 glass-card rounded-2xl p-4 shadow-card animate-float hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-interu-mint-light flex items-center justify-center">
                    <Mic className="w-5 h-5 text-interu-mint" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Voice Active</p>
                    <p className="text-xs text-muted-foreground">Recording...</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 glass-card rounded-2xl p-4 shadow-card animate-float hidden lg:block" style={{ animationDelay: "2s" }}>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-interu-blue flex items-center justify-center text-xs font-medium text-primary-foreground">JD</div>
                    <div className="w-8 h-8 rounded-full bg-interu-coral flex items-center justify-center text-xs font-medium text-primary-foreground">SK</div>
                    <div className="w-8 h-8 rounded-full bg-interu-purple flex items-center justify-center text-xs font-medium text-primary-foreground">AM</div>
                  </div>
                  <span className="text-sm text-muted-foreground">+9 more</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
