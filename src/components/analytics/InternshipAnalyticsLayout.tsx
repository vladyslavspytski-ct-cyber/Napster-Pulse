import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { InternshipRubric } from "@/lib/mockAnalyticsData";

interface Props {
  rubric: InternshipRubric;
  summary: string;
}

const CHART_BLUE = "hsl(220, 70%, 55%)";
const CHART_CORAL = "hsl(15, 85%, 60%)";
const CHART_MINT = "hsl(160, 50%, 50%)";

export default function InternshipAnalyticsLayout({ rubric, summary }: Props) {
  const radarData = rubric.scores.map((s) => ({
    metric: s.metric,
    value: s.value,
    fullMark: 10,
  }));

  const rankingData = rubric.ranking.map((r) => ({
    ...r,
    isHighlighted: r.candidate === "This Candidate",
  }));

  return (
    <div className="space-y-6">
      {/* Summary + Composite Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center">
          <CardContent className="pt-6 text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              Composite Score
            </p>
            <p className="text-5xl font-bold text-primary">{rubric.composite_score}</p>
            <p className="text-xs text-muted-foreground mt-1">out of 10</p>
          </CardContent>
        </Card>
      </div>

      {/* Radar + Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Skill Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                <Radar
                  dataKey="value"
                  stroke={CHART_BLUE}
                  fill={CHART_BLUE}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Top 5 Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rankingData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis
                  dataKey="candidate"
                  type="category"
                  width={100}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {rankingData.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={entry.isHighlighted ? CHART_CORAL : CHART_BLUE}
                      fillOpacity={entry.isHighlighted ? 1 : 0.7}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Strengths + Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {rubric.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Risks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {rubric.risks.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
