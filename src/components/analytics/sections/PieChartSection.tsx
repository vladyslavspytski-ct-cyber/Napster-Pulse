import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PieChartItem {
  label: string;
  value: number;
  color?: string;
}

const DEFAULT_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--interu-mint))",
  "hsl(var(--interu-purple))",
  "hsl(var(--destructive))",
  "hsl(var(--muted-foreground))",
];

export default function PieChartSection({ title, data }: { title: string; data: PieChartItem[] }) {
  return (
    <Card className="group hover:shadow-card-hover transition-shadow duration-300">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              strokeWidth={2}
              stroke="hsl(var(--card))"
            >
              {data.map((entry, i) => (
                <Cell key={entry.label} fill={entry.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
