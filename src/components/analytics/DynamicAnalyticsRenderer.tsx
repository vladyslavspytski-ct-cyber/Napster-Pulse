import type { RubricSection } from "@/lib/mockAnalyticsData";
import ScoreCardSection from "./sections/ScoreCardSection";
import RadarChartSection from "./sections/RadarChartSection";
import BarChartSection from "./sections/BarChartSection";
import StackedBarSection from "./sections/StackedBarSection";
import ListSection from "./sections/ListSection";
import RankingSection from "./sections/RankingSection";
import TextBlockSection from "./sections/TextBlockSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Schema-driven analytics renderer.
 *
 * To add a new section type:
 * 1. Create a new component in `sections/`
 * 2. Add a case to the switch below
 * 3. Use the new type in your rubric JSON — done!
 */

interface Props {
  summary: string;
  sections: RubricSection[];
}

function renderSection(section: RubricSection) {
  switch (section.type) {
    case "score_card":
      return <ScoreCardSection title={section.title} data={section.data as any} />;
    case "radar_chart":
      return <RadarChartSection title={section.title} data={section.data as any} />;
    case "bar_chart":
      return <BarChartSection title={section.title} data={section.data as any} />;
    case "stacked_bar":
      return <StackedBarSection title={section.title} data={section.data as any} />;
    case "list":
      return <ListSection title={section.title} data={section.data as any} />;
    case "ranking":
      return <RankingSection title={section.title} data={section.data as any} />;
    case "text_block":
      return <TextBlockSection title={section.title} data={section.data as any} />;
    default:
      return (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Unsupported section type: <code>{section.type}</code>
            </p>
          </CardContent>
        </Card>
      );
  }
}

export default function DynamicAnalyticsRenderer({ summary, sections }: Props) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        </CardContent>
      </Card>

      {/* Dynamic sections */}
      {sections.map((section) => (
        <div key={section.id}>{renderSection(section)}</div>
      ))}
    </div>
  );
}
