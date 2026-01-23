import { useEffect, useRef, useState } from "react";
import { 
  Mic, 
  BarChart3, 
  Users, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  MessageSquare,
  Sparkles,
  Share2
} from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Button } from "@/components/ui/button";

const ProductPreviewSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="product-preview" className="py-20 md:py-32 hero-gradient" ref={sectionRef}>
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-interu-coral-light text-accent text-sm font-medium mb-4">
            Product Preview
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Powerful insights at your fingertips
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience a dashboard designed for clarity. Get actionable insights from every interview.
          </p>
        </div>

        {/* Main Dashboard Preview */}
        <div
          className={`relative max-w-5xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="glass-card rounded-3xl p-4 md:p-8 shadow-lg">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-foreground">Creator Dashboard</h3>
                <p className="text-sm text-muted-foreground">Welcome back! Here's your interview overview.</p>
              </div>
              <div className="flex gap-3">
                <SecondaryButton size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </SecondaryButton>
                <PrimaryButton size="sm" className="gap-2">
                  <Mic className="w-4 h-4" />
                  New Interview
                </PrimaryButton>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Users, label: "Total Participants", value: "248", color: "text-primary", bg: "bg-interu-blue-light" },
                { icon: CheckCircle2, label: "Completed", value: "186", color: "text-interu-mint", bg: "bg-interu-mint-light" },
                { icon: Clock, label: "In Progress", value: "42", color: "text-interu-coral", bg: "bg-interu-coral-light" },
                { icon: BarChart3, label: "Avg. Score", value: "8.4", color: "text-interu-purple", bg: "bg-interu-purple-light" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-2xl ${stat.bg} transition-all duration-500`}
                  style={{ transitionDelay: `${index * 100 + 200}ms` }}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Sentiment Analysis Card */}
              <div className="bg-muted/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-interu-coral" />
                    Sentiment Analysis
                  </h4>
                  <span className="text-xs text-muted-foreground">Last 7 days</span>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: "Positive", value: 72, color: "bg-interu-mint" },
                    { label: "Neutral", value: 20, color: "bg-interu-gray" },
                    { label: "Negative", value: 8, color: "bg-interu-coral" },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium text-foreground">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                          style={{ 
                            width: isVisible ? `${item.value}%` : "0%",
                            transitionDelay: `${index * 150 + 500}ms` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Responses Card */}
              <div className="bg-muted/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Recent Responses
                  </h4>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View All
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {[
                    { name: "Sarah M.", time: "2 min ago", score: 9.2, trend: "up" },
                    { name: "James K.", time: "15 min ago", score: 7.8, trend: "up" },
                    { name: "Emily R.", time: "1 hr ago", score: 8.5, trend: "up" },
                  ].map((response, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl bg-card border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-medium text-primary-foreground">
                          {response.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{response.name}</p>
                          <p className="text-xs text-muted-foreground">{response.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-interu-mint" />
                        <span className="font-semibold text-foreground">{response.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-interu-blue/10 via-transparent to-interu-coral/10 rounded-full blur-3xl" />
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {["AI-Powered Analysis", "Real-time Updates", "Export to PDF", "Team Collaboration", "Custom Reports"].map(
            (tag, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full bg-card border border-border text-sm text-muted-foreground"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductPreviewSection;
