// ─── Schema-driven rubric types ───

export type SectionType =
  | "score_card"
  | "radar_chart"
  | "bar_chart"
  | "stacked_bar"
  | "list"
  | "ranking"
  | "text_block"
  | "pie_chart"
  | "line_chart"
  | "area_chart"
  | "horizontal_bar_chart"
  | "composed_chart";

export interface RubricSection {
  id: string;
  type: SectionType;
  title: string;
  /** Payload shape depends on `type` – see per-section components */
  data: unknown;
}

export interface DynamicRubric {
  summary: string;
  sections: RubricSection[];
}

export interface AnalyticsInterview {
  id: string;
  title: string;
  type: string;
  rubric: DynamicRubric;
}

// ─── Mock interviews ───

export const mockAnalyticsInterviews: AnalyticsInterview[] = [
  {
    id: "mock-internship-1",
    title: "Internship / Entry-Level Screening",
    type: "internship_screening",
    rubric: {
      summary:
        "Candidate demonstrates strong learning agility and clear career motivation. Execution discipline is an area for development.",
      sections: [
        {
          id: "composite",
          type: "score_card",
          title: "Composite Score",
          data: { value: 8.1, max: 10 },
        },
        {
          id: "profile",
          type: "radar_chart",
          title: "Candidate Profile",
          data: [
            { metric: "Learning Agility", value: 8.7 },
            { metric: "Motivation & Alignment", value: 9.1 },
            { metric: "Execution & Discipline", value: 6.8 },
            { metric: "Resilience", value: 7.9 },
          ],
        },
        {
          id: "ranking",
          type: "ranking",
          title: "Top 5 Candidates",
          data: {
            highlightLabel: "This Candidate",
            items: [
              { label: "Anna K.", value: 8.9 },
              { label: "This Candidate", value: 8.1 },
              { label: "Mark T.", value: 7.8 },
              { label: "Leo P.", value: 7.5 },
              { label: "Nina S.", value: 7.2 },
            ],
          },
        },
        {
          id: "strengths",
          type: "list",
          title: "Strengths",
          data: {
            variant: "positive",
            items: ["Self-driven learning", "Clear career direction", "Growth mindset"],
          },
        },
        {
          id: "risks",
          type: "list",
          title: "Risks",
          data: {
            variant: "warning",
            items: ["Limited real-world delivery experience"],
          },
        },
      ],
    },
  },
  {
    id: "mock-360-feedback-1",
    title: "360 Feedback Interview",
    type: "360_feedback",
    rubric: {
      summary:
        "Overall positive peer perception with high reliability scores. Communication clarity and delegation identified as key improvement areas.",
      sections: [
        {
          id: "leadership",
          type: "radar_chart",
          title: "Leadership Metrics",
          data: [
            { metric: "Communication", value: 7.2 },
            { metric: "Reliability", value: 8.9 },
            { metric: "Team Morale Impact", value: 8.1 },
            { metric: "Leadership Influence", value: 6.8 },
          ],
        },
        {
          id: "sentiment",
          type: "stacked_bar",
          title: "Sentiment Breakdown",
          data: {
            segments: [
              { label: "Positive", value: 64, color: "hsl(160, 50%, 50%)" },
              { label: "Neutral", value: 24, color: "hsl(220, 10%, 60%)" },
              { label: "Negative", value: 12, color: "hsl(0, 84%, 60%)" },
            ],
          },
        },
        {
          id: "improvements",
          type: "bar_chart",
          title: "Improvement Themes",
          data: {
            dataKey: "mentions",
            categoryKey: "theme",
            items: [
              { theme: "Communication clarity", mentions: 4 },
              { theme: "Delegation", mentions: 2 },
            ],
          },
        },
        {
          id: "recommendation",
          type: "text_block",
          title: "Recommendation",
          data: {
            text: "Focus coaching efforts on structured communication frameworks and delegation practices. Consider pairing with a senior mentor for 90-day improvement plan.",
          },
        },
      ],
    },
  },
  {
    id: "mock-internship-2",
    title: "Internship – Advanced Skill Profile",
    type: "internship_screening",
    rubric: {
      summary:
        "Candidate shows a balanced skill distribution with strong technical aptitude. Growth trajectory is positive with a notable gap in delegation skills.",
      sections: [
        {
          id: "perf-index",
          type: "score_card",
          title: "Composite Performance Index",
          data: { value: 7.6, max: 10 },
        },
        {
          id: "skill-dist",
          type: "pie_chart",
          title: "Skill Distribution",
          data: [
            { label: "Technical", value: 38 },
            { label: "Communication", value: 22 },
            { label: "Initiative", value: 24 },
            { label: "Reliability", value: 16 },
          ],
        },
        {
          id: "growth",
          type: "line_chart",
          title: "Projected Growth (6 Months)",
          data: {
            xKey: "month",
            yKey: "score",
            items: [
              { month: "Month 1", score: 5.2 },
              { month: "Month 2", score: 5.8 },
              { month: "Month 3", score: 6.5 },
              { month: "Month 4", score: 7.1 },
              { month: "Month 5", score: 7.4 },
              { month: "Month 6", score: 8.0 },
            ],
          },
        },
        {
          id: "skill-gap",
          type: "horizontal_bar_chart",
          title: "Skill Gap Comparison",
          data: {
            categoryKey: "skill",
            valueKey: "gap",
            highlightThreshold: 2.5,
            items: [
              { skill: "Delegation", gap: 3.1 },
              { skill: "Conflict Resolution", gap: 2.6 },
              { skill: "Time Management", gap: 1.4 },
              { skill: "Presentation Skills", gap: 1.1 },
              { skill: "Data Analysis", gap: 0.6 },
            ],
          },
        },
        {
          id: "exec-insight",
          type: "text_block",
          title: "Executive Insight",
          data: {
            text: "This candidate's technical foundation is solid, but soft skills — especially delegation — need structured development. A mentorship pairing during the first quarter is recommended to accelerate readiness for cross-functional projects.",
          },
        },
      ],
    },
  },
  {
    id: "mock-360-feedback-2",
    title: "360 Feedback – Alignment Analysis",
    type: "360_feedback",
    rubric: {
      summary:
        "Manager and peer ratings show notable divergence on collaboration. Consistency across respondents is moderate, with leadership as the strongest theme.",
      sections: [
        {
          id: "mgr-peer",
          type: "composed_chart",
          title: "Manager vs Peer Comparison",
          data: {
            xKey: "metric",
            barKey: "manager",
            lineKey: "peer",
            barLabel: "Manager Score",
            lineLabel: "Peer Avg",
            items: [
              { metric: "Communication", manager: 8.2, peer: 7.0 },
              { metric: "Collaboration", manager: 7.5, peer: 5.8 },
              { metric: "Leadership", manager: 8.8, peer: 8.1 },
              { metric: "Reliability", manager: 9.0, peer: 8.7 },
              { metric: "Innovation", manager: 6.5, peer: 7.2 },
            ],
          },
        },
        {
          id: "consistency",
          type: "area_chart",
          title: "Consistency Trend Across Respondents",
          data: {
            xKey: "respondent",
            yKey: "consistency",
            items: [
              { respondent: "R1", consistency: 7.8 },
              { respondent: "R2", consistency: 6.5 },
              { respondent: "R3", consistency: 7.2 },
              { respondent: "R4", consistency: 8.1 },
              { respondent: "R5", consistency: 7.0 },
              { respondent: "R6", consistency: 7.9 },
            ],
          },
        },
        {
          id: "strength-themes",
          type: "pie_chart",
          title: "Strength Theme Distribution",
          data: [
            { label: "Leadership", value: 34 },
            { label: "Reliability", value: 28 },
            { label: "Strategic Thinking", value: 22 },
            { label: "Empathy", value: 16 },
          ],
        },
        {
          id: "sentiment-v2",
          type: "stacked_bar",
          title: "Sentiment Breakdown",
          data: {
            segments: [
              { label: "Positive", value: 58, color: "hsl(160, 50%, 50%)" },
              { label: "Neutral", value: 28, color: "hsl(220, 10%, 60%)" },
              { label: "Negative", value: 14, color: "hsl(0, 84%, 60%)" },
            ],
          },
        },
        {
          id: "ai-insight",
          type: "text_block",
          title: "AI Insight Summary",
          data: {
            text: "The gap between manager and peer collaboration scores (1.7 points) suggests potential blind spots in team dynamics. A facilitated 360 debrief session is recommended to align expectations and address collaboration friction points.",
          },
        },
      ],
    },
  },
];

export function getMockAnalyticsInterview(id: string): AnalyticsInterview | undefined {
  return mockAnalyticsInterviews.find((i) => i.id === id);
}
