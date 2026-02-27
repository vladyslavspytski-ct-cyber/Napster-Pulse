import type { DashboardSection } from "@/hooks/api/useInterviewDashboard";

import {
  SummarySectionExp,
  StatsCardsSectionExp,
  WordCloudSectionExp,
  RecurringThemesSectionExp,
  TopQuotesSectionExp,
  KeyIdeasSectionExp,
  RedFlagsSectionExp,
  LeaderboardSectionExp,
  CriteriaBenchmarksSection,
  SkillsRadarSection,
  DistributionChartSection,
} from "./sections-experimental";

interface SectionRendererExpProps {
  section: DashboardSection;
  title: string;
  completedCount: number;
}

/**
 * Experimental section renderer with enhanced visual design.
 * Maps section.type to experimental components where available,
 * falls back to original components for sections without experimental versions.
 */
export const SectionRendererExp = ({ section, title, completedCount }: SectionRendererExpProps) => {
  const { type, data } = section;

  if (!data) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyData = data as any;

  switch (type) {
    case "summary":
      return (
        <SummarySectionExp
          data={anyData}
          title={title}
          completedCount={completedCount}
        />
      );

    case "stats_cards":
      return <StatsCardsSectionExp data={anyData} />;

    case "word_cloud":
      return <WordCloudSectionExp data={anyData} />;

    case "recurring_themes":
      return <RecurringThemesSectionExp data={anyData} />;

    case "top_quotes":
      return <TopQuotesSectionExp data={anyData} />;

    case "key_ideas":
      return <KeyIdeasSectionExp data={anyData} />;

    case "leaderboard":
      return <LeaderboardSectionExp data={anyData} />;

    // Original sections (no experimental version yet)

    case "criteria_benchmarks":
      return <CriteriaBenchmarksSection data={anyData} />;

    case "comparative_analysis":
      return <SkillsRadarSection data={anyData} />;

    case "red_flags":
      return <RedFlagsSectionExp data={anyData} />;

    case "distribution_chart":
      return <DistributionChartSection data={anyData} />;

    default:
      console.warn(`[SectionRendererExp] Unknown section type: ${type}`);
      return null;
  }
};

export default SectionRendererExp;
