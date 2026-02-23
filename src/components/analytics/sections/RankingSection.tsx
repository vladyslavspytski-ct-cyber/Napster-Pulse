import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface RankingItem {
  label: string;
  value: number;
}

interface RankingData {
  highlightLabel?: string;
  items: RankingItem[];
}

export default function RankingSection({ title, data }: { title: string; data: RankingData }) {
  return (
    <Card className="group hover:shadow-card-hover transition-shadow duration-300">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={Math.max(200, data.items.length * 48)}>
          <BarChart data={data.items} layout="vertical" margin={{ left: 10, right: 12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis
              type="number"
              domain={[0, 10]}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="label"
              type="category"
              width={110}
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
                boxShadow: "var(--shadow-md)",
              }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {data.items.map((item, idx) => (
                <Cell
                  key={idx}
                  fill={
                    data.highlightLabel && item.label === data.highlightLabel
                      ? "hsl(var(--accent))"
                      : "hsl(var(--primary))"
                  }
                  fillOpacity={data.highlightLabel && item.label === data.highlightLabel ? 1 : 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
