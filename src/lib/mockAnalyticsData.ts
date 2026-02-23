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

export interface AnalyticsParticipant {
  id: string;
  name: string;
  email: string;
  compositeScore: number;
  rubric: DynamicRubric;
}

export interface AnalyticsInterview {
  id: string;
  title: string;
  type: string;
  participants: AnalyticsParticipant[];
}

// ─── Helper to build aggregate overview from participants ───

export interface InterviewOverviewData {
  totalParticipants: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  /** Sorted descending by compositeScore */
  rankedParticipants: { id: string; name: string; score: number }[];
}

export function getInterviewOverview(interview: AnalyticsInterview): InterviewOverviewData {
  const scores = interview.participants.map((p) => p.compositeScore);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return {
    totalParticipants: scores.length,
    averageScore: Math.round(avg * 10) / 10,
    highestScore: Math.max(...scores),
    lowestScore: Math.min(...scores),
    rankedParticipants: interview.participants
      .map((p) => ({ id: p.id, name: p.name, score: p.compositeScore }))
      .sort((a, b) => b.score - a.score),
  };
}

// ─── Mock interviews with participants ───

export const mockAnalyticsInterviews: AnalyticsInterview[] = [
  {
    id: "mock-internship-1",
    title: "Internship / Entry-Level Screening",
    type: "internship_screening",
    participants: [
      {
        id: "p1",
        name: "Alex Rivera",
        email: "alex.r@university.edu",
        compositeScore: 8.1,
        rubric: {
          summary: "Candidate demonstrates strong learning agility and clear career motivation. Execution discipline is an area for development.",
          sections: [
            { id: "composite", type: "score_card", title: "Composite Score", data: { value: 8.1, max: 10 } },
            { id: "profile", type: "radar_chart", title: "Candidate Profile", data: [
              { metric: "Learning Agility", value: 8.7 },
              { metric: "Motivation & Alignment", value: 9.1 },
              { metric: "Execution & Discipline", value: 6.8 },
              { metric: "Resilience", value: 7.9 },
            ]},
            { id: "strengths", type: "list", title: "Strengths", data: { variant: "positive", items: ["Self-driven learning", "Clear career direction", "Growth mindset"] } },
            { id: "risks", type: "list", title: "Risks", data: { variant: "warning", items: ["Limited real-world delivery experience"] } },
          ],
        },
      },
      {
        id: "p2",
        name: "Anna Kim",
        email: "anna.k@college.edu",
        compositeScore: 8.9,
        rubric: {
          summary: "Outstanding candidate with exceptional initiative and strong technical foundations.",
          sections: [
            { id: "composite", type: "score_card", title: "Composite Score", data: { value: 8.9, max: 10 } },
            { id: "profile", type: "radar_chart", title: "Candidate Profile", data: [
              { metric: "Learning Agility", value: 9.2 },
              { metric: "Motivation & Alignment", value: 8.8 },
              { metric: "Execution & Discipline", value: 8.5 },
              { metric: "Resilience", value: 8.4 },
            ]},
            { id: "strengths", type: "list", title: "Strengths", data: { variant: "positive", items: ["Strong initiative", "Technical aptitude", "Team collaboration"] } },
            { id: "risks", type: "list", title: "Risks", data: { variant: "warning", items: ["May need mentorship on prioritization"] } },
          ],
        },
      },
      {
        id: "p3",
        name: "Mark Torres",
        email: "mark.t@uni.edu",
        compositeScore: 7.8,
        rubric: {
          summary: "Solid candidate with good fundamentals. Communication skills are a notable strength.",
          sections: [
            { id: "composite", type: "score_card", title: "Composite Score", data: { value: 7.8, max: 10 } },
            { id: "profile", type: "radar_chart", title: "Candidate Profile", data: [
              { metric: "Learning Agility", value: 7.5 },
              { metric: "Motivation & Alignment", value: 8.0 },
              { metric: "Execution & Discipline", value: 7.2 },
              { metric: "Resilience", value: 7.6 },
            ]},
            { id: "strengths", type: "list", title: "Strengths", data: { variant: "positive", items: ["Clear communicator", "Adaptable"] } },
            { id: "risks", type: "list", title: "Risks", data: { variant: "warning", items: ["Limited project experience", "Needs structured guidance"] } },
          ],
        },
      },
      {
        id: "p4",
        name: "Leo Park",
        email: "leo.p@school.edu",
        compositeScore: 7.5,
        rubric: {
          summary: "Promising candidate with strong motivation but needs development in execution skills.",
          sections: [
            { id: "composite", type: "score_card", title: "Composite Score", data: { value: 7.5, max: 10 } },
            { id: "profile", type: "radar_chart", title: "Candidate Profile", data: [
              { metric: "Learning Agility", value: 7.8 },
              { metric: "Motivation & Alignment", value: 8.5 },
              { metric: "Execution & Discipline", value: 6.2 },
              { metric: "Resilience", value: 7.0 },
            ]},
            { id: "strengths", type: "list", title: "Strengths", data: { variant: "positive", items: ["Highly motivated", "Quick learner"] } },
            { id: "risks", type: "list", title: "Risks", data: { variant: "warning", items: ["Execution gaps", "Time management"] } },
          ],
        },
      },
      {
        id: "p5",
        name: "Nina Sato",
        email: "nina.s@campus.edu",
        compositeScore: 7.2,
        rubric: {
          summary: "Candidate shows potential but needs significant development across multiple areas.",
          sections: [
            { id: "composite", type: "score_card", title: "Composite Score", data: { value: 7.2, max: 10 } },
            { id: "profile", type: "radar_chart", title: "Candidate Profile", data: [
              { metric: "Learning Agility", value: 7.0 },
              { metric: "Motivation & Alignment", value: 7.8 },
              { metric: "Execution & Discipline", value: 6.5 },
              { metric: "Resilience", value: 7.1 },
            ]},
            { id: "strengths", type: "list", title: "Strengths", data: { variant: "positive", items: ["Curious mindset"] } },
            { id: "risks", type: "list", title: "Risks", data: { variant: "warning", items: ["Needs structured environment", "Limited technical depth"] } },
          ],
        },
      },
    ],
  },
  {
    id: "mock-360-feedback-1",
    title: "360 Feedback Interview",
    type: "360_feedback",
    participants: [
      {
        id: "f1",
        name: "Jordan Blake",
        email: "jordan.b@company.com",
        compositeScore: 7.8,
        rubric: {
          summary: "Overall positive peer perception with high reliability scores. Communication clarity and delegation identified as key improvement areas.",
          sections: [
            { id: "leadership", type: "radar_chart", title: "Leadership Metrics", data: [
              { metric: "Communication", value: 7.2 },
              { metric: "Reliability", value: 8.9 },
              { metric: "Team Morale Impact", value: 8.1 },
              { metric: "Leadership Influence", value: 6.8 },
            ]},
            { id: "sentiment", type: "stacked_bar", title: "Sentiment Breakdown", data: { segments: [
              { label: "Positive", value: 64, color: "hsl(160, 50%, 50%)" },
              { label: "Neutral", value: 24, color: "hsl(220, 10%, 60%)" },
              { label: "Negative", value: 12, color: "hsl(0, 84%, 60%)" },
            ]}},
            { id: "improvements", type: "bar_chart", title: "Improvement Themes", data: { dataKey: "mentions", categoryKey: "theme", items: [
              { theme: "Communication clarity", mentions: 4 },
              { theme: "Delegation", mentions: 2 },
            ]}},
            { id: "recommendation", type: "text_block", title: "Recommendation", data: { text: "Focus coaching efforts on structured communication frameworks and delegation practices." } },
          ],
        },
      },
      {
        id: "f2",
        name: "Casey Morgan",
        email: "casey.m@company.com",
        compositeScore: 8.4,
        rubric: {
          summary: "Strong overall performer. Peers consistently rate reliability and leadership as top strengths.",
          sections: [
            { id: "leadership", type: "radar_chart", title: "Leadership Metrics", data: [
              { metric: "Communication", value: 8.5 },
              { metric: "Reliability", value: 9.2 },
              { metric: "Team Morale Impact", value: 7.8 },
              { metric: "Leadership Influence", value: 8.1 },
            ]},
            { id: "sentiment", type: "stacked_bar", title: "Sentiment Breakdown", data: { segments: [
              { label: "Positive", value: 72, color: "hsl(160, 50%, 50%)" },
              { label: "Neutral", value: 20, color: "hsl(220, 10%, 60%)" },
              { label: "Negative", value: 8, color: "hsl(0, 84%, 60%)" },
            ]}},
            { id: "recommendation", type: "text_block", title: "Recommendation", data: { text: "Continue current trajectory. Consider mentoring junior team members to amplify leadership impact." } },
          ],
        },
      },
      {
        id: "f3",
        name: "Riley Chen",
        email: "riley.c@company.com",
        compositeScore: 6.9,
        rubric: {
          summary: "Mixed feedback. Strong technical skills but interpersonal dynamics need attention.",
          sections: [
            { id: "leadership", type: "radar_chart", title: "Leadership Metrics", data: [
              { metric: "Communication", value: 5.8 },
              { metric: "Reliability", value: 7.5 },
              { metric: "Team Morale Impact", value: 6.2 },
              { metric: "Leadership Influence", value: 6.4 },
            ]},
            { id: "sentiment", type: "stacked_bar", title: "Sentiment Breakdown", data: { segments: [
              { label: "Positive", value: 45, color: "hsl(160, 50%, 50%)" },
              { label: "Neutral", value: 30, color: "hsl(220, 10%, 60%)" },
              { label: "Negative", value: 25, color: "hsl(0, 84%, 60%)" },
            ]}},
            { id: "recommendation", type: "text_block", title: "Recommendation", data: { text: "Prioritize communication coaching and 1:1 relationship building exercises." } },
          ],
        },
      },
    ],
  },
  {
    id: "mock-internship-2",
    title: "Internship – Advanced Skill Profile",
    type: "internship_screening",
    participants: [
      {
        id: "a1",
        name: "Sam Williams",
        email: "sam.w@tech.edu",
        compositeScore: 7.6,
        rubric: {
          summary: "Candidate shows a balanced skill distribution with strong technical aptitude. Growth trajectory is positive with a notable gap in delegation skills.",
          sections: [
            { id: "perf-index", type: "score_card", title: "Composite Performance Index", data: { value: 7.6, max: 10 } },
            { id: "skill-dist", type: "pie_chart", title: "Skill Distribution", data: [
              { label: "Technical", value: 38 },
              { label: "Communication", value: 22 },
              { label: "Initiative", value: 24 },
              { label: "Reliability", value: 16 },
            ]},
            { id: "growth", type: "line_chart", title: "Projected Growth (6 Months)", data: { xKey: "month", yKey: "score", items: [
              { month: "Month 1", score: 5.2 },
              { month: "Month 2", score: 5.8 },
              { month: "Month 3", score: 6.5 },
              { month: "Month 4", score: 7.1 },
              { month: "Month 5", score: 7.4 },
              { month: "Month 6", score: 8.0 },
            ]}},
            { id: "skill-gap", type: "horizontal_bar_chart", title: "Skill Gap Comparison", data: { categoryKey: "skill", valueKey: "gap", highlightThreshold: 2.5, items: [
              { skill: "Delegation", gap: 3.1 },
              { skill: "Conflict Resolution", gap: 2.6 },
              { skill: "Time Management", gap: 1.4 },
              { skill: "Presentation Skills", gap: 1.1 },
              { skill: "Data Analysis", gap: 0.6 },
            ]}},
            { id: "exec-insight", type: "text_block", title: "Executive Insight", data: { text: "This candidate's technical foundation is solid, but soft skills — especially delegation — need structured development." } },
          ],
        },
      },
      {
        id: "a2",
        name: "Jamie Lee",
        email: "jamie.l@tech.edu",
        compositeScore: 8.3,
        rubric: {
          summary: "Exceptional candidate with strong initiative and reliability. Minor gaps in presentation skills.",
          sections: [
            { id: "perf-index", type: "score_card", title: "Composite Performance Index", data: { value: 8.3, max: 10 } },
            { id: "skill-dist", type: "pie_chart", title: "Skill Distribution", data: [
              { label: "Technical", value: 32 },
              { label: "Communication", value: 28 },
              { label: "Initiative", value: 26 },
              { label: "Reliability", value: 14 },
            ]},
            { id: "exec-insight", type: "text_block", title: "Executive Insight", data: { text: "Ready for cross-functional project involvement. Strong candidate for accelerated development track." } },
          ],
        },
      },
    ],
  },
  {
    id: "mock-360-feedback-2",
    title: "360 Feedback – Alignment Analysis",
    type: "360_feedback",
    participants: [
      {
        id: "b1",
        name: "Taylor Nguyen",
        email: "taylor.n@corp.com",
        compositeScore: 7.9,
        rubric: {
          summary: "Manager and peer ratings show notable divergence on collaboration. Consistency across respondents is moderate, with leadership as the strongest theme.",
          sections: [
            { id: "mgr-peer", type: "composed_chart", title: "Manager vs Peer Comparison", data: { xKey: "metric", barKey: "manager", lineKey: "peer", barLabel: "Manager Score", lineLabel: "Peer Avg", items: [
              { metric: "Communication", manager: 8.2, peer: 7.0 },
              { metric: "Collaboration", manager: 7.5, peer: 5.8 },
              { metric: "Leadership", manager: 8.8, peer: 8.1 },
              { metric: "Reliability", manager: 9.0, peer: 8.7 },
              { metric: "Innovation", manager: 6.5, peer: 7.2 },
            ]}},
            { id: "consistency", type: "area_chart", title: "Consistency Trend Across Respondents", data: { xKey: "respondent", yKey: "consistency", items: [
              { respondent: "R1", consistency: 7.8 },
              { respondent: "R2", consistency: 6.5 },
              { respondent: "R3", consistency: 7.2 },
              { respondent: "R4", consistency: 8.1 },
              { respondent: "R5", consistency: 7.0 },
              { respondent: "R6", consistency: 7.9 },
            ]}},
            { id: "strength-themes", type: "pie_chart", title: "Strength Theme Distribution", data: [
              { label: "Leadership", value: 34 },
              { label: "Reliability", value: 28 },
              { label: "Strategic Thinking", value: 22 },
              { label: "Empathy", value: 16 },
            ]},
            { id: "ai-insight", type: "text_block", title: "AI Insight Summary", data: { text: "The gap between manager and peer collaboration scores (1.7 points) suggests potential blind spots in team dynamics. A facilitated 360 debrief session is recommended." } },
          ],
        },
      },
      {
        id: "b2",
        name: "Drew Patel",
        email: "drew.p@corp.com",
        compositeScore: 8.5,
        rubric: {
          summary: "Highly consistent ratings across all respondents. Strong alignment between manager and peer perspectives.",
          sections: [
            { id: "mgr-peer", type: "composed_chart", title: "Manager vs Peer Comparison", data: { xKey: "metric", barKey: "manager", lineKey: "peer", barLabel: "Manager Score", lineLabel: "Peer Avg", items: [
              { metric: "Communication", manager: 8.6, peer: 8.4 },
              { metric: "Collaboration", manager: 8.2, peer: 8.0 },
              { metric: "Leadership", manager: 9.0, peer: 8.8 },
              { metric: "Reliability", manager: 8.8, peer: 8.9 },
              { metric: "Innovation", manager: 7.8, peer: 8.1 },
            ]}},
            { id: "ai-insight", type: "text_block", title: "AI Insight Summary", data: { text: "Exceptional alignment between manager and peer views. This individual is well-calibrated and a strong candidate for leadership development programs." } },
          ],
        },
      },
    ],
  },
];

// ─── Lookup helpers ───

export function getMockAnalyticsInterview(id: string): AnalyticsInterview | undefined {
  return mockAnalyticsInterviews.find((i) => i.id === id);
}

export function getMockAnalyticsParticipant(
  interviewId: string,
  candidateId: string
): AnalyticsParticipant | undefined {
  const interview = getMockAnalyticsInterview(interviewId);
  return interview?.participants.find((p) => p.id === candidateId);
}
