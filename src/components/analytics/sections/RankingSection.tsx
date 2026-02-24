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

const BLUE = "hsl(220, 70%, 55%)";
const CORAL = "hsl(15, 85%, 60%)";

export default function RankingSection({ title, data }: { title: string; data: RankingData }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(200, data.items.length * 50)}>
          <BarChart data={data.items} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              domain={[0, 10]}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              dataKey="label"
              type="category"
              width={110}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.items.map((item, idx) => (
                <Cell
                  key={idx}
                  fill={data.highlightLabel && item.label === data.highlightLabel ? CORAL : BLUE}
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
