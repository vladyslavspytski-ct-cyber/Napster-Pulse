import type { DashboardSection } from "@/hooks/api/useInterviewDashboard";

import {
  SummarySection,
  StatsCardsSection,
  WordCloudSection,
  CriteriaBenchmarksSection,
  RedFlagsSection,
  LeaderboardSection,
  TopQuotesSection,
  KeyIdeasSection,
  RecurringThemesSection,
  SkillsRadarSection,
  DynamicInsightsSection,
  DistributionChartSection,
} from "./sections";

interface SectionRendererProps {
  section: DashboardSection;
  title: string;
  completedCount: number;
}

/**
 * Dynamic section renderer that maps section.type to the appropriate component.
 * Unknown section types are gracefully ignored.
 * Each component handles its own data normalization for flexible backend formats.
 */
export const SectionRenderer = ({ section, title, completedCount }: SectionRendererProps) => {
  const { type, data } = section;

  // Early return if no data
  if (!data) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyData = data as any;

  switch (type) {
    case "summary":
      return (
        <SummarySection
          data={anyData}
          title={title}
          completedCount={completedCount}
        />
      );

    case "stats_cards":
      return <StatsCardsSection data={anyData} />;

    case "word_cloud":
      return <WordCloudSection data={anyData} />;

    case "leaderboard":
      return <LeaderboardSection data={anyData} />;

    case "criteria_benchmarks":
      return <CriteriaBenchmarksSection data={anyData} />;

    case "skills_radar":
      return <SkillsRadarSection data={anyData} />;

    case "recurring_themes":
      return <RecurringThemesSection data={anyData} />;

    case "red_flags":
      return <RedFlagsSection data={anyData} />;

    case "key_ideas":
      return <KeyIdeasSection data={anyData} />;

    case "top_quotes":
      return <TopQuotesSection data={anyData} />;

    case "dynamic_insights":
      return <DynamicInsightsSection data={anyData} />;

    case "distribution_chart":
      return <DistributionChartSection data={anyData} />;

    default:
      // Unknown section type - gracefully ignore
      console.warn(`[SectionRenderer] Unknown section type: ${type}`);
      return null;
  }
};

export default SectionRenderer;
