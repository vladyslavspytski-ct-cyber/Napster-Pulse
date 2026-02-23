import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Users, TrendingUp, TrendingDown, Trophy, ChevronDown, ChevronUp, Eye } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMockAnalyticsInterview, getInterviewOverview } from "@/lib/mockAnalyticsData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export default function InterviewOverview() {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const [showRanking, setShowRanking] = useState(false);

  const interview = interviewId ? getMockAnalyticsInterview(interviewId) : undefined;

  if (!interview) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-24 pb-8 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
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

  const overview = getInterviewOverview(interview);

  // Build score distribution data for bar chart
  const scoreBuckets = [
    { range: "6.0–6.9", count: 0 },
    { range: "7.0–7.4", count: 0 },
    { range: "7.5–7.9", count: 0 },
    { range: "8.0–8.4", count: 0 },
    { range: "8.5–9.0", count: 0 },
    { range: "9.1+", count: 0 },
  ];
  interview.participants.forEach((p) => {
    const s = p.compositeScore;
    if (s < 7) scoreBuckets[0].count++;
    else if (s < 7.5) scoreBuckets[1].count++;
    else if (s < 8) scoreBuckets[2].count++;
    else if (s < 8.5) scoreBuckets[3].count++;
    else if (s <= 9) scoreBuckets[4].count++;
    else scoreBuckets[5].count++;
  });

  // Average radar: aggregate all radar sections across participants
  const radarMap = new Map<string, { sum: number; count: number }>();
  interview.participants.forEach((p) => {
    p.rubric.sections.forEach((sec) => {
      if (sec.type === "radar_chart" && Array.isArray(sec.data)) {
        (sec.data as { metric: string; value: number }[]).forEach(({ metric, value }) => {
          const e = radarMap.get(metric) || { sum: 0, count: 0 };
          e.sum += value;
          e.count++;
          radarMap.set(metric, e);
        });
      }
    });
  });
  const avgRadar = Array.from(radarMap.entries()).map(([metric, { sum, count }]) => ({
    metric,
    value: Math.round((sum / count) * 10) / 10,
  }));

  const stats = [
    { label: "Total Participants", value: overview.totalParticipants, icon: Users, color: "text-primary" },
    { label: "Average Score", value: overview.averageScore, icon: TrendingUp, color: "text-primary" },
    { label: "Highest Score", value: overview.highestScore, icon: Trophy, color: "text-green-600" },
    { label: "Lowest Score", value: overview.lowestScore, icon: TrendingDown, color: "text-orange-500" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="section-container">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-8">
            <button onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to Dashboard
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{interview.title}</h1>
              <Badge variant="secondary" className="w-fit text-xs font-medium capitalize">{interview.type.replace(/_/g, " ")}</Badge>
              <Badge variant="outline" className="w-fit text-xs font-medium">Overview</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Aggregate analytics across {overview.totalParticipants} participants.
            </p>
          </motion.div>

          {/* Stat cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
              <Card key={s.label} className="group hover:shadow-card-hover transition-shadow duration-300">
                <CardContent className="pt-6 pb-6 text-center">
                  <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
                  <p className="text-3xl font-bold text-foreground tabular-nums">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Charts grid */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            {/* Score Distribution */}
            <Card className="group hover:shadow-card-hover transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-foreground">Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={scoreBuckets} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="range" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Average Skill Radar */}
            {avgRadar.length > 0 && (
              <Card className="group hover:shadow-card-hover transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-foreground">Average Skill Radar</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={avgRadar} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid className="stroke-border" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                      <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 10 }} className="fill-muted-foreground" />
                      <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Top Candidates */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
            <Card className="group hover:shadow-card-hover transition-shadow duration-300">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-muted-foreground" /> Top Candidates
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowRanking(!showRanking)} className="text-xs gap-1">
                  {showRanking ? "Hide" : "View"} Ranking
                  {showRanking ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </Button>
              </CardHeader>
              {showRanking && (
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-left">
                          <th className="pb-2 pr-4 font-medium">Rank</th>
                          <th className="pb-2 pr-4 font-medium">Name</th>
                          <th className="pb-2 pr-4 font-medium text-right">Score</th>
                          <th className="pb-2 font-medium text-right">Profile</th>
                        </tr>
                      </thead>
                      <tbody>
                        {overview.rankedParticipants.map((p, i) => (
                          <tr key={p.id} className="border-b border-border/50 last:border-0">
                            <td className="py-2.5 pr-4 font-medium text-foreground">{i + 1}</td>
                            <td className="py-2.5 pr-4 text-foreground">{p.name}</td>
                            <td className="py-2.5 pr-4 text-right tabular-nums font-semibold text-primary">{p.score}</td>
                            <td className="py-2.5 text-right">
                              <Link
                                to={`/dashboard/interview/${interviewId}/candidate/${p.id}`}
                                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                              >
                                <Eye className="w-3.5 h-3.5" /> View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
