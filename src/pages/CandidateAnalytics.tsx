import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMockAnalyticsInterview, getMockAnalyticsParticipant } from "@/lib/mockAnalyticsData";
import DynamicAnalyticsRenderer from "@/components/analytics/DynamicAnalyticsRenderer";

export default function CandidateAnalytics() {
  const { interviewId, candidateId } = useParams<{ interviewId: string; candidateId: string }>();
  const navigate = useNavigate();

  const interview = interviewId ? getMockAnalyticsInterview(interviewId) : undefined;
  const participant = interviewId && candidateId ? getMockAnalyticsParticipant(interviewId, candidateId) : undefined;

  if (!interview || !participant) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-24 pb-8 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-2">
              <span className="text-2xl">👤</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Candidate not found</h1>
            <p className="text-sm text-muted-foreground">The analytics for this candidate are unavailable.</p>
            <Button variant="outline" onClick={() => navigate(interviewId ? `/dashboard/interview/${interviewId}` : "/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
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
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
              <span>/</span>
              <Link to={`/dashboard/interview/${interviewId}`} className="hover:text-foreground transition-colors">{interview.title}</Link>
              <span>/</span>
              <span className="text-foreground">{participant.name}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{participant.name}</h1>
              <Badge variant="secondary" className="w-fit text-xs font-medium capitalize">{interview.type.replace(/_/g, " ")}</Badge>
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-3.5 h-3.5" />
              <span>{participant.email}</span>
            </div>

            <p className="mt-3 text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {participant.rubric.summary}
            </p>
          </motion.div>

          {/* Analytics sections */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <DynamicAnalyticsRenderer sections={participant.rubric.sections} />
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
