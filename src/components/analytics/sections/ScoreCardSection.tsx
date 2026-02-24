import { Card, CardContent } from "@/components/ui/card";

interface ScoreCardData {
  value: number;
  max?: number;
}

export default function ScoreCardSection({ title, data }: { title: string; data: ScoreCardData }) {
  return (
    <Card className="flex flex-col items-center justify-center">
      <CardContent className="pt-6 pb-6 text-center">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{title}</p>
        <p className="text-5xl font-bold text-primary">{data.value}</p>
        {data.max && (
          <p className="text-xs text-muted-foreground mt-1">out of {data.max}</p>
        )}
      </CardContent>
    </Card>
  );
}
