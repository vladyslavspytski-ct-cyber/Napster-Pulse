// ─── Schema-driven rubric types ───

export type SectionType =
  | "score_card"
  | "radar_chart"
  | "bar_chart"
  | "stacked_bar"
  | "list"
  | "ranking"
  | "text_block";

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
];

export function getMockAnalyticsInterview(id: string): AnalyticsInterview | undefined {
  return mockAnalyticsInterviews.find((i) => i.id === id);
}
