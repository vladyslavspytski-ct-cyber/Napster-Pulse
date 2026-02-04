import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { 
  Mic, 
  BarChart3, 
  Users, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  MessageSquare,
  Sparkles,
  Share2,
  Copy,
  ExternalLink,
  FileText,
  Calendar,
  ChevronRight
} from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Button } from "@/components/ui/button";

const ProductPreviewSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activePreview, setActivePreview] = useState<"dashboard" | "saved">("dashboard");
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

        {/* Preview Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full bg-muted/50 p-1 border border-border">
            <button
              onClick={() => setActivePreview("dashboard")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activePreview === "dashboard" 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActivePreview("saved")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activePreview === "saved" 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Saved Interviews
            </button>
          </div>
        </div>

        {/* Main Dashboard Preview */}
        <motion.div
          className={`relative max-w-5xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {activePreview === "dashboard" ? (
            <DashboardPreview isVisible={isVisible} />
          ) : (
            <SavedInterviewsPreview isVisible={isVisible} />
          )}

          {/* Decorative Elements */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-interu-blue/10 via-transparent to-interu-coral/10 rounded-full blur-3xl" />
        </motion.div>

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

// Dashboard Preview Component
const DashboardPreview = ({ isVisible }: { isVisible: boolean }) => (
  <div className="glass-card rounded-3xl p-4 md:p-8 shadow-lg">
    {/* Dashboard Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
      <div>
        <h3 className="text-xl md:text-2xl font-semibold text-foreground">Interview Dashboard</h3>
        <p className="text-sm text-muted-foreground">Product Manager Interview — Q1 2026</p>
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
        { icon: Users, label: "Total Participants", value: "24", color: "text-primary", bg: "bg-interu-blue-light" },
        { icon: CheckCircle2, label: "Completed", value: "18", color: "text-interu-mint", bg: "bg-interu-mint-light" },
        { icon: Clock, label: "In Progress", value: "4", color: "text-interu-coral", bg: "bg-interu-coral-light" },
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
                <motion.div
                  className={`h-full ${item.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: isVisible ? `${item.value}%` : "0%" }}
                  transition={{ duration: 0.8, delay: index * 0.15 + 0.5 }}
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
            { name: "Sarah Mitchell", time: "2 min ago", score: 9.2 },
            { name: "James Kim", time: "15 min ago", score: 7.8 },
            { name: "Emily Roberts", time: "1 hr ago", score: 8.5 },
          ].map((response, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl bg-card border border-border"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -10 }}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.6 }}
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
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Saved Interviews Preview Component
const SavedInterviewsPreview = ({ isVisible }: { isVisible: boolean }) => (
  <div className="glass-card rounded-3xl p-4 md:p-8 shadow-lg">
    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
      <div>
        <h3 className="text-xl md:text-2xl font-semibold text-foreground">Saved Interviews</h3>
        <p className="text-sm text-muted-foreground">Manage your interview templates and share links</p>
      </div>
      <PrimaryButton size="sm" className="gap-2">
        <Mic className="w-4 h-4" />
        Create Interview
      </PrimaryButton>
    </div>

    {/* Search Bar */}
    <div className="mb-6">
      <div className="relative max-w-md">
        <div className="h-10 rounded-lg bg-muted/50 border border-border px-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-sm text-muted-foreground">Search by title...</span>
        </div>
      </div>
    </div>

    {/* Interview List */}
    <div className="space-y-3">
      {[
        { title: "Product Manager Interview — Q1 2026", questions: 8, responses: 24, date: "Jan 15, 2026", active: true },
        { title: "UX Designer Screening", questions: 6, responses: 12, date: "Jan 12, 2026", active: true },
        { title: "Customer Feedback Survey", questions: 10, responses: 156, date: "Jan 8, 2026", active: false },
        { title: "Engineering Lead Assessment", questions: 12, responses: 8, date: "Jan 5, 2026", active: true },
      ].map((interview, index) => (
        <motion.div
          key={index}
          className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-interu-blue-light flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{interview.title}</h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {interview.questions} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {interview.responses} responses
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {interview.date}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {interview.active && (
                <span className="px-2 py-0.5 rounded-full bg-interu-mint-light text-interu-mint text-xs font-medium">
                  Active
                </span>
              )}
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <span className="text-xs">View</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Pagination Preview */}
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
      <Button variant="outline" size="sm" disabled>
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">Page 1 of 3</span>
      <Button variant="outline" size="sm">
        Next
      </Button>
    </div>
  </div>
);

export default ProductPreviewSection;
