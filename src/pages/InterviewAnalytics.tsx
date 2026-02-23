import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMockAnalyticsInterview } from "@/lib/mockAnalyticsData";
import DynamicAnalyticsRenderer from "@/components/analytics/DynamicAnalyticsRenderer";

export default function InterviewAnalytics() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const interview = id ? getMockAnalyticsInterview(id) : undefined;

  if (!interview) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-24 pb-8 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-2">
              <span className="text-2xl">📊</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Interview not found</h1>
            <p className="text-sm text-muted-foreground">The analytics for this interview are unavailable.</p>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="section-container">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to Dashboard
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                {interview.title}
              </h1>
              <Badge
                variant="secondary"
                className="w-fit text-xs font-medium capitalize"
              >
                {interview.type.replace(/_/g, " ")}
              </Badge>
            </div>

            <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {interview.rubric.summary}
            </p>
          </motion.div>

          {/* Analytics content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <DynamicAnalyticsRenderer sections={interview.rubric.sections} />
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
