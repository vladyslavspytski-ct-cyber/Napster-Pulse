import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { 
  Search,
  FileText,
  Users,
  User,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

        {/* Main Dashboard Preview - Master-Detail Layout */}
        <motion.div
          className={`relative max-w-6xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* Cropped container with fade-out */}
          <div className="relative max-h-[400px] md:max-h-[480px] lg:max-h-[520px] overflow-hidden rounded-3xl">
            <div className="glass-card rounded-3xl p-4 md:p-6 shadow-lg overflow-hidden">
              {/* Dashboard Header */}
              <div className="mb-6 pb-4 border-b border-border">
                <h3 className="text-xl font-semibold text-foreground">Conducted Interviews</h3>
              <p className="text-sm text-muted-foreground">View responses from all your completed interview sessions</p>
            </div>

            {/* Master-Detail Layout */}
            <div className="flex gap-6">
              {/* Left Column - Interview List */}
              <div className="w-[280px] lg:w-[320px] flex-shrink-0 hidden md:block">
                <div className="bg-card border border-border rounded-2xl p-4">
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <div className="h-9 rounded-lg bg-muted/50 border border-border pl-9 flex items-center">
                      <span className="text-sm text-muted-foreground">Search interviews...</span>
                    </div>
                  </div>

                  {/* Interview List */}
                  <div className="space-y-2">
                    {[
                      { title: "Product Manager Interview — Q1 2026", responses: 24, date: "Jan 15", selected: true },
                      { title: "UX Designer Screening", responses: 12, date: "Jan 12", selected: false },
                      { title: "Customer Feedback Survey", responses: 156, date: "Jan 8", selected: false },
                      { title: "Engineering Lead Assessment", responses: 8, date: "Jan 5", selected: false },
                    ].map((interview, index) => (
                      <motion.div
                        key={index}
                        className={`p-3 rounded-xl border transition-all ${
                          interview.selected 
                            ? "bg-primary/5 border-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.3)]" 
                            : "bg-card border-border"
                        }`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -10 }}
                        transition={{ duration: 0.4, delay: index * 0.08 + 0.2 }}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            interview.selected ? "bg-primary/10" : "bg-muted"
                          }`}>
                            <FileText className={`w-4 h-4 ${interview.selected ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className={`text-sm font-medium truncate ${interview.selected ? "text-primary" : "text-foreground"}`}>
                              {interview.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{interview.date}</span>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Users className="w-3 h-3" />
                                <span>{interview.responses}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
                    <Button variant="ghost" size="sm" className="h-7 px-2" disabled>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">1 / 3</span>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column - Detail View */}
              <div className="flex-1 min-w-0">
                {/* Detail Header */}
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <h4 className="text-lg font-semibold text-foreground">Product Manager Interview — Q1 2026</h4>
                    <div className="flex-1 max-w-[200px] ml-auto hidden sm:block">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <div className="h-9 rounded-lg bg-muted/50 border border-border pl-9 flex items-center">
                          <span className="text-sm text-muted-foreground">Search participants...</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sentiment Filter Pills */}
                  <div className="flex gap-2 flex-wrap">
                    {["All", "Positive", "Neutral", "Negative"].map((sentiment, index) => (
                      <Button
                        key={sentiment}
                        variant={index === 0 ? "default" : "outline"}
                        size="sm"
                        className="h-8 capitalize"
                      >
                        {sentiment}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Sentiment Distribution Cards */}
                <motion.div 
                  className="grid grid-cols-3 gap-3 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  {[
                    { label: "Positive", value: 78, icon: TrendingUp, bg: "bg-emerald-50 dark:bg-emerald-950/30", iconColor: "text-emerald-500", textColor: "text-emerald-600 dark:text-emerald-400" },
                    { label: "Neutral", value: 18, icon: MessageSquare, bg: "bg-slate-100 dark:bg-slate-800/50", iconColor: "text-slate-500", textColor: "text-slate-600 dark:text-slate-400" },
                    { label: "Negative", value: 4, icon: BarChart3, bg: "bg-rose-50 dark:bg-rose-950/30", iconColor: "text-rose-500", textColor: "text-rose-600 dark:text-rose-400" },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className={`rounded-xl p-3 lg:p-4 ${item.bg}`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                          <span className={`text-xs font-medium ${item.textColor}`}>{item.label}</span>
                        </div>
                        <div className="text-xl lg:text-2xl font-semibold text-foreground">{item.value}%</div>
                      </div>
                    );
                  })}
                </motion.div>

                {/* Conducted Run Cards */}
                <div className="space-y-3">
                  {[
                    { name: "Sarah Mitchell", email: "sarah.m@company.com", sentiment: "positive", summary: "Excellent candidate with strong product vision. Demonstrated clear understanding of user-centric design principles and data-driven decision making.", date: "Jan 15, 2026", time: "2:30 PM" },
                    { name: "James Kim", email: "james.k@startup.io", sentiment: "positive", summary: "Great communication skills and technical background. Showed impressive experience in cross-functional team leadership.", date: "Jan 15, 2026", time: "11:15 AM" },
                    { name: "Emily Roberts", email: "emily.r@tech.co", sentiment: "neutral", summary: "Good foundational knowledge but could benefit from more hands-on experience with agile methodologies.", date: "Jan 14, 2026", time: "4:45 PM" },
                  ].map((run, index) => (
                    <motion.div
                      key={index}
                      className="p-4 bg-card border border-border rounded-xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-medium text-foreground truncate">{run.name}</h5>
                            <p className="text-sm text-muted-foreground truncate">{run.email}</p>
                          </div>
                        </div>
                        <Badge 
                          variant={run.sentiment === "positive" ? "default" : "secondary"}
                          className={
                            run.sentiment === "positive" 
                              ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" 
                              : "bg-muted text-muted-foreground border-border hover:bg-muted"
                          }
                        >
                          {run.sentiment}
                        </Badge>
                      </div>

                      {/* Summary */}
                      <p className="text-sm text-foreground/80 leading-relaxed mb-3 line-clamp-2">
                        {run.summary}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{run.date}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{run.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Runs Pagination */}
                <div className="flex items-center justify-center gap-4 pt-4 mt-4 border-t border-border">
                  <Button variant="outline" size="sm" className="h-8 px-3" disabled>
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Prev
                  </Button>
                  <span className="text-sm text-muted-foreground">Page 1 of 6</span>
                  <Button variant="outline" size="sm" className="h-8 px-3">
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

            {/* Bottom fade-out gradient overlay */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-32 md:h-40 pointer-events-none rounded-b-3xl"
              style={{
                background: 'linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.9) 30%, hsl(var(--background) / 0.5) 60%, transparent 100%)'
              }}
            />
          </div>

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

export default ProductPreviewSection;
