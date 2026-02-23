import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  getMockAnalyticsInterview,
  type InternshipRubric,
  type FeedbackRubric,
} from "@/lib/mockAnalyticsData";
import InternshipAnalyticsLayout from "@/components/analytics/InternshipAnalyticsLayout";
import FeedbackAnalyticsLayout from "@/components/analytics/FeedbackAnalyticsLayout";

export default function InterviewAnalytics() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const interview = id ? getMockAnalyticsInterview(id) : undefined;

  if (!interview) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-24 pb-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Interview not found</h1>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-8">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Back + Title */}
            <div className="flex items-center gap-3 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="h-8 px-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {interview.title}
                </h1>
                <p className="text-sm text-muted-foreground capitalize">
                  {interview.type.replace(/_/g, " ")}
                </p>
              </div>
            </div>

            {/* Conditional layout */}
            {interview.type === "internship_screening" && (
              <InternshipAnalyticsLayout
                rubric={interview.rubric as InternshipRubric}
                summary={interview.summary}
              />
            )}

            {interview.type === "360_feedback" && (
              <FeedbackAnalyticsLayout
                rubric={interview.rubric as FeedbackRubric}
                summary={interview.summary}
              />
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
