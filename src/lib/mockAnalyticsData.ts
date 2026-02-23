export interface ScoreMetric {
  metric: string;
  value: number;
}

export interface RankingEntry {
  candidate: string;
  score: number;
}

export interface InternshipRubric {
  composite_score: number;
  scores: ScoreMetric[];
  strengths: string[];
  risks: string[];
  ranking: RankingEntry[];
}

export interface SentimentBreakdown {
  positive: number;
  neutral: number;
  negative: number;
}

export interface ImprovementCluster {
  theme: string;
  mentions: number;
}

export interface FeedbackRubric {
  aggregated_scores: ScoreMetric[];
  sentiment_breakdown: SentimentBreakdown;
  improvement_clusters: ImprovementCluster[];
}

export interface AnalyticsInterview {
  id: string;
  title: string;
  type: "internship_screening" | "360_feedback";
  summary: string;
  rubric: InternshipRubric | FeedbackRubric;
}

export const mockAnalyticsInterviews: AnalyticsInterview[] = [
  {
    id: "mock-internship-1",
    title: "Internship / Entry-Level Screening",
    type: "internship_screening",
    summary:
      "Candidate demonstrates strong learning agility and clear career motivation. Execution discipline is an area for development.",
    rubric: {
      composite_score: 8.1,
      scores: [
        { metric: "Learning Agility", value: 8.7 },
        { metric: "Motivation & Alignment", value: 9.1 },
        { metric: "Execution & Discipline", value: 6.8 },
        { metric: "Resilience", value: 7.9 },
      ],
      strengths: [
        "Self-driven learning",
        "Clear career direction",
        "Growth mindset",
      ],
      risks: ["Limited real-world delivery experience"],
      ranking: [
        { candidate: "Anna K.", score: 8.9 },
        { candidate: "This Candidate", score: 8.1 },
        { candidate: "Mark T.", score: 7.8 },
        { candidate: "Leo P.", score: 7.5 },
        { candidate: "Nina S.", score: 7.2 },
      ],
    } as InternshipRubric,
  },
  {
    id: "mock-360-feedback-1",
    title: "360 Feedback Interview",
    type: "360_feedback",
    summary:
      "Overall positive peer perception with high reliability scores. Communication clarity and delegation identified as key improvement areas.",
    rubric: {
      aggregated_scores: [
        { metric: "Communication", value: 7.2 },
        { metric: "Reliability", value: 8.9 },
        { metric: "Team Morale Impact", value: 8.1 },
        { metric: "Leadership Influence", value: 6.8 },
      ],
      sentiment_breakdown: {
        positive: 64,
        neutral: 24,
        negative: 12,
      },
      improvement_clusters: [
        { theme: "Communication clarity", mentions: 4 },
        { theme: "Delegation", mentions: 2 },
      ],
    } as FeedbackRubric,
  },
];

export function getMockAnalyticsInterview(id: string): AnalyticsInterview | undefined {
  return mockAnalyticsInterviews.find((i) => i.id === id);
}
