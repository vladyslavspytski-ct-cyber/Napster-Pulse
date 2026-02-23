import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HorizontalBarData {
  categoryKey: string;
  valueKey: string;
  items: Record<string, unknown>[];
  /** Optional: highlight items where gap > threshold */
  highlightThreshold?: number;
}

export default function HorizontalBarChartSection({
  title,
  data,
}: {
  title: string;
  data: HorizontalBarData;
}) {
  return (
    <Card className="group hover:shadow-card-hover transition-shadow duration-300">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={Math.max(180, data.items.length * 48)}>
          <BarChart data={data.items} layout="vertical" margin={{ left: 24, right: 12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey={data.categoryKey}
              type="category"
              width={130}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey={data.valueKey} radius={[0, 6, 6, 0]} fillOpacity={0.85}>
              {data.items.map((item, i) => {
                const val = Number(item[data.valueKey]) || 0;
                const isHigh =
                  data.highlightThreshold !== undefined && val >= data.highlightThreshold;
                return (
                  <Cell
                    key={i}
                    fill={isHigh ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
