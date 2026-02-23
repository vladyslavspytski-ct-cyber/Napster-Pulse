import { Card, CardContent } from "@/components/ui/card";

interface ScoreCardData {
  value: number;
  max?: number;
}

export default function ScoreCardSection({ title, data }: { title: string; data: ScoreCardData }) {
  const pct = data.max ? (data.value / data.max) * 100 : null;

  return (
    <Card className="group hover:shadow-card-hover transition-shadow duration-300 overflow-hidden relative">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent pointer-events-none" />
      <CardContent className="pt-8 pb-8 text-center relative">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
          {title}
        </p>
        <p className="text-6xl font-bold text-primary tabular-nums">{data.value}</p>
        {data.max && (
          <>
            <p className="text-sm text-muted-foreground mt-2">out of {data.max}</p>
            {pct !== null && (
              <div className="mt-4 mx-auto max-w-[180px]">
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
