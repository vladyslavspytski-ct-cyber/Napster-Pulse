import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComposedChartData {
  xKey: string;
  barKey: string;
  lineKey: string;
  barLabel?: string;
  lineLabel?: string;
  items: Record<string, unknown>[];
}

export default function ComposedChartSection({
  title,
  data,
}: {
  title: string;
  data: ComposedChartData;
}) {
  return (
    <Card className="group hover:shadow-card-hover transition-shadow duration-300">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data.items} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis
              dataKey={data.xKey}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
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
            <Legend
              iconSize={10}
              wrapperStyle={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}
            />
            <Bar
              dataKey={data.barKey}
              name={data.barLabel || data.barKey}
              fill="hsl(var(--primary))"
              fillOpacity={0.7}
              radius={[4, 4, 0, 0]}
              barSize={28}
            />
            <Line
              type="monotone"
              dataKey={data.lineKey}
              name={data.lineLabel || data.lineKey}
              stroke="hsl(var(--accent))"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "hsl(var(--accent))", strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
