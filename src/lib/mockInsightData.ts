/* ─── Shared mock data for Insight Demo concepts ─── */

export interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export interface SkillRadar {
  skill: string;
  average: number;
  benchmark: number;
}

export interface CriteriaBenchmark {
  criteria: string;
  score: number;
  max: number;
  percentile: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  highlights: string[];
}

export interface RecurringTheme {
  word: string;
  weight: number;
}

export interface RedFlag {
  issue: string;
  severity: "high" | "medium" | "low";
  occurrences: number;
}

export interface InsightData {
  title: string;
  completed_count: number;
  created_at: string;
  overall_status: string;
  overall_score: number;
  summary: string;
  stats_cards: StatCard[];
  skills_radar: SkillRadar[];
  criteria_benchmarks: CriteriaBenchmark[];
  leaderboard: LeaderboardEntry[];
  recurring_themes: RecurringTheme[];
  red_flags: RedFlag[];
  key_ideas: string[];
  top_quotes: string[];
  word_cloud: RecurringTheme[];
}

export const INSIGHT_MOCK: InsightData = {
  title: "360° Leadership Assessment",
  completed_count: 18,
  created_at: "2026-02-10T10:00:00Z",
  overall_status: "Strong Alignment",
  overall_score: 82,
  summary:
    "Participants demonstrate exceptional collaboration and strategic thinking. Communication clarity remains the primary area for growth, with delegation patterns showing improvement over previous cycles. Cross-functional alignment is notably strong in senior cohorts.",

  stats_cards: [
    { label: "Avg. Score", value: 82, change: "+4.2%", trend: "up" },
    { label: "Completion Rate", value: "94%", change: "+12%", trend: "up" },
    { label: "Avg. Duration", value: "14m", change: "-2m", trend: "down" },
    { label: "Response Quality", value: "High", trend: "neutral" },
  ],

  skills_radar: [
    { skill: "Communication", average: 72, benchmark: 80 },
    { skill: "Leadership", average: 85, benchmark: 78 },
    { skill: "Collaboration", average: 88, benchmark: 82 },
    { skill: "Problem Solving", average: 79, benchmark: 75 },
    { skill: "Strategic Thinking", average: 83, benchmark: 77 },
    { skill: "Adaptability", average: 76, benchmark: 80 },
  ],

  criteria_benchmarks: [
    { criteria: "Performance & Impact", score: 88, max: 100, percentile: 92 },
    { criteria: "Team Dynamics", score: 82, max: 100, percentile: 78 },
    { criteria: "Growth Mindset", score: 79, max: 100, percentile: 71 },
    { criteria: "Communication", score: 72, max: 100, percentile: 58 },
    { criteria: "Initiative", score: 85, max: 100, percentile: 85 },
  ],

  leaderboard: [
    { rank: 1, name: "Sarah Chen", score: 94, highlights: ["Strategic Thinking", "Leadership"] },
    { rank: 2, name: "Marcus Rivera", score: 91, highlights: ["Collaboration", "Initiative"] },
    { rank: 3, name: "Aisha Patel", score: 89, highlights: ["Problem Solving", "Adaptability"] },
    { rank: 4, name: "James O'Brien", score: 86, highlights: ["Communication", "Team Dynamics"] },
    { rank: 5, name: "Yuki Tanaka", score: 84, highlights: ["Growth Mindset", "Performance"] },
  ],

  recurring_themes: [
    { word: "collaboration", weight: 28 },
    { word: "communication", weight: 24 },
    { word: "alignment", weight: 18 },
    { word: "leadership", weight: 16 },
    { word: "initiative", weight: 14 },
    { word: "clarity", weight: 12 },
    { word: "delegation", weight: 10 },
    { word: "ownership", weight: 9 },
    { word: "feedback", weight: 8 },
    { word: "empathy", weight: 6 },
  ],

  red_flags: [
    { issue: "Communication gaps in cross-team handoffs", severity: "high", occurrences: 7 },
    { issue: "Inconsistent delegation practices", severity: "medium", occurrences: 5 },
    { issue: "Feedback loops delayed beyond 48h", severity: "medium", occurrences: 4 },
    { issue: "Role ambiguity in project transitions", severity: "low", occurrences: 2 },
  ],

  key_ideas: [
    "Implement structured weekly alignment syncs across teams.",
    "Create a communication playbook for cross-functional projects.",
    "Establish clear ownership matrices for new initiatives.",
    "Introduce peer-feedback cadence at sprint retrospectives.",
  ],

  top_quotes: [
    "The leadership vision is clear, but translation to daily priorities needs work.",
    "Cross-team collaboration has never been stronger.",
    "We need more structured feedback — not more meetings.",
    "Initiative is high, but delegation remains inconsistent.",
  ],

  word_cloud: [
    { word: "collaboration", weight: 28 },
    { word: "communication", weight: 24 },
    { word: "alignment", weight: 18 },
    { word: "leadership", weight: 16 },
    { word: "initiative", weight: 14 },
    { word: "clarity", weight: 12 },
    { word: "delegation", weight: 10 },
    { word: "ownership", weight: 9 },
    { word: "feedback", weight: 8 },
    { word: "empathy", weight: 6 },
    { word: "transparency", weight: 5 },
    { word: "accountability", weight: 11 },
  ],
};
