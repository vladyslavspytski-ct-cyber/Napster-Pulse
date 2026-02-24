// Mock analytics data matching the backend shape
export interface ChartDataset {
  label: string;
  data: number[];
}

export interface AggregateChartResult {
  chart_name: string;
  chart_type: "radar" | "bar" | "doughnut" | "score" | "horizontal_bar" | "line" | "area";
  data: {
    labels: string[];
    datasets: ChartDataset[];
  };
}

export interface InterviewAnalyticsData {
  interview_title: string;
  completed_count: number;
  created_at?: string;
  aggregate_overall_score?: number;
  aggregate_chart_results: AggregateChartResult[];
}

export const MOCK_ANALYTICS: InterviewAnalyticsData = {
  interview_title: "Senior Product Manager – 360° Leadership Review",
  completed_count: 24,
  created_at: "2025-12-10T09:00:00Z",
  aggregate_overall_score: 78,
  aggregate_chart_results: [
    {
      chart_name: "Leadership Competencies",
      chart_type: "radar",
      data: {
        labels: [
          "Strategic Vision",
          "Communication",
          "Decision Making",
          "Team Empowerment",
          "Stakeholder Mgmt",
          "Innovation",
        ],
        datasets: [
          { label: "Average", data: [82, 74, 88, 70, 76, 65] },
          { label: "Max", data: [95, 92, 98, 90, 88, 85] },
          { label: "Min", data: [60, 55, 72, 48, 58, 42] },
          { label: "Median", data: [84, 76, 90, 72, 78, 68] },
        ],
      },
    },
    {
      chart_name: "Performance & Impact",
      chart_type: "bar",
      data: {
        labels: ["Goal Achievement", "Revenue Impact", "Team Growth", "Process Improvement", "Customer Satisfaction"],
        datasets: [
          { label: "Average", data: [85, 72, 78, 68, 90] },
          { label: "Max", data: [98, 95, 92, 88, 100] },
          { label: "Min", data: [65, 50, 60, 45, 75] },
        ],
      },
    },
    {
      chart_name: "Score Distribution",
      chart_type: "doughnut",
      data: {
        labels: ["Excellent (90+)", "Strong (75-89)", "Developing (60-74)", "Below Expectations (<60)"],
        datasets: [{ label: "Candidates", data: [6, 11, 5, 2] }],
      },
    },
    {
      chart_name: "Cultural Alignment",
      chart_type: "score",
      data: {
        labels: ["Alignment Score"],
        datasets: [
          { label: "Average", data: [82] },
          { label: "Max", data: [96] },
          { label: "Min", data: [61] },
        ],
      },
    },
    {
      chart_name: "Communication Trends",
      chart_type: "line",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
        datasets: [
          { label: "Average", data: [65, 70, 72, 78, 80, 82] },
          { label: "Median", data: [63, 68, 70, 76, 78, 80] },
        ],
      },
    },
    {
      chart_name: "Skill Breakdown",
      chart_type: "horizontal_bar",
      data: {
        labels: ["Technical Depth", "Product Sense", "Analytical Rigor", "Collaboration", "Adaptability"],
        datasets: [
          { label: "Average", data: [75, 88, 82, 70, 78] },
          { label: "Median", data: [76, 90, 84, 72, 80] },
        ],
      },
    },
  ],
};

// Color palette for chart datasets
export const DATASET_COLORS: Record<string, { stroke: string; fill: string }> = {
  Average: { stroke: "hsl(220 70% 55%)", fill: "hsl(220 70% 55% / 0.15)" },
  Median: { stroke: "hsl(260 60% 60%)", fill: "hsl(260 60% 60% / 0.12)" },
  Max: { stroke: "hsl(160 50% 50%)", fill: "hsl(160 50% 50% / 0.10)" },
  Min: { stroke: "hsl(15 85% 60%)", fill: "hsl(15 85% 60% / 0.10)" },
  Candidates: { stroke: "hsl(220 70% 55%)", fill: "hsl(220 70% 55% / 0.8)" },
};

export const DOUGHNUT_COLORS = [
  "hsl(220 70% 55%)",
  "hsl(260 60% 60%)",
  "hsl(160 50% 50%)",
  "hsl(15 85% 60%)",
];
