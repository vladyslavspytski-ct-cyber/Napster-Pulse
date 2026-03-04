import type { DashboardSection } from "@/hooks/api/useInterviewDashboard";

// Reuse unchanged sections from v1
import {
  SummarySection,
  SkillsRadarSection,
  CriteriaBenchmarksSection,
  LeaderboardSection,
} from "@/components/interview-dashboard/sections";

// V2 redesigned sections
import { RecurringThemesSectionV2 } from "./sections/RecurringThemesSectionV2";
import WordCloudSectionV2 from "./sections/WordCloudSectionV2";
import { TopQuotesSectionV2 } from "./sections/TopQuotesSectionV2";
import { DistributionChartSectionV2 } from "./sections/DistributionChartSectionV2";
import { KeyIdeasSectionV2 } from "./sections/KeyIdeasSectionV2";
import { RedFlagsSectionV2 } from "./sections/RedFlagsSectionV2";
import { StatsCardsSectionV2 } from "./sections/StatsCardsSectionV2";

interface SectionRendererV2Props {
  section: DashboardSection;
  title: string;
  completedCount: number;
}

/**
 * V2 section renderer — uses redesigned components for
 * recurring_themes, word_cloud, top_quotes; reuses all others from v1.
 */
export const SectionRendererV2 = ({ section, title, completedCount }: SectionRendererV2Props) => {
  const { type, data } = section;
  if (!data) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyData = data as any;

  switch (type) {
    case "summary":
      return <SummarySection data={anyData} title={title} completedCount={completedCount} />;
    case "stats_cards":
      return <StatsCardsSectionV2 data={anyData} />;
    case "word_cloud":
      return <WordCloudSectionV2 data={anyData} />;
    case "leaderboard":
      return <LeaderboardSection data={anyData} />;
    case "criteria_benchmarks":
      return <CriteriaBenchmarksSection data={anyData} />;
    case "comparative_analysis":
      return <SkillsRadarSection data={anyData} />;
    case "recurring_themes":
      return <RecurringThemesSectionV2 data={anyData} />;
    case "red_flags":
      return <RedFlagsSectionV2 data={anyData} />;
    case "key_ideas":
      return <KeyIdeasSectionV2 data={anyData} />;
    case "top_quotes":
      return <TopQuotesSectionV2 data={anyData} />;
    case "distribution_chart":
      return <DistributionChartSectionV2 data={anyData} />;
    default:
      console.warn(`[SectionRendererV2] Unknown section type: ${type}`);
      return null;
  }
};

export default SectionRendererV2;
