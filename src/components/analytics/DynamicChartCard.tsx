import { motion } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell,
  LineChart, Line,
  AreaChart, Area,
  ResponsiveContainer, Tooltip, Legend,
} from "recharts";
import type { AggregateChartResult } from "@/lib/mockAnalyticsData";
import { DATASET_COLORS, DOUGHNUT_COLORS } from "@/lib/mockAnalyticsData";

interface DynamicChartCardProps {
  chart: AggregateChartResult;
  index: number;
  isWide?: boolean;
  tier?: "primary" | "secondary";
}

const CustomTooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "12px",
  boxShadow: "0 8px 24px -4px hsl(220 20% 10% / 0.12)",
};

const DynamicChartCard = ({ chart, index, isWide, tier = "secondary" }: DynamicChartCardProps) => {
  const isPrimary = tier === "primary";

  const renderChart = () => {
    const { chart_type, data } = chart;
    switch (chart_type) {
      case "radar": return renderRadar(data);
      case "bar": return renderBar(data);
      case "horizontal_bar": return renderHorizontalBar(data);
      case "doughnut": return renderDoughnut(data);
      case "score": return renderScore(data);
      case "line": return renderLine(data);
      case "area": return renderArea(data);
      default: return renderBar(data);
    }
  };

  const renderRadar = (data: AggregateChartResult["data"]) => {
    const chartData = data.labels.map((label, i) => {
      const point: Record<string, string | number> = { subject: label };
      data.datasets.forEach((ds) => { point[ds.label] = ds.data[i]; });
      return point;
    });
    return (
      <ResponsiveContainer width="100%" height={isPrimary ? 380 : 320}>
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="hsl(var(--analytics-grid-line))" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <PolarRadiusAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
          {data.datasets.map((ds) => (
            <Radar key={ds.label} name={ds.label} dataKey={ds.label}
              stroke={DATASET_COLORS[ds.label]?.stroke ?? "hsl(var(--primary))"}
              fill={DATASET_COLORS[ds.label]?.fill ?? "hsl(var(--primary) / 0.1)"}
              strokeWidth={ds.label === "Average" ? 2.5 : 1.5}
              fillOpacity={ds.label === "Average" ? 0.2 : 0.05}
            />
          ))}
          <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
          <Tooltip contentStyle={CustomTooltipStyle} />
        </RadarChart>
      </ResponsiveContainer>
    );
  };

  const renderBar = (data: AggregateChartResult["data"]) => {
    const chartData = data.labels.map((label, i) => {
      const point: Record<string, string | number> = { name: label };
      data.datasets.forEach((ds) => { point[ds.label] = ds.data[i]; });
      return point;
    });
    return (
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--analytics-grid-line))" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          {data.datasets.map((ds) => (
            <Bar key={ds.label} dataKey={ds.label}
              fill={DATASET_COLORS[ds.label]?.stroke ?? "hsl(var(--primary))"}
              radius={[4, 4, 0, 0]} opacity={ds.label === "Average" ? 1 : 0.5}
            />
          ))}
          <Tooltip contentStyle={CustomTooltipStyle} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderHorizontalBar = (data: AggregateChartResult["data"]) => {
    const chartData = data.labels.map((label, i) => {
      const point: Record<string, string | number> = { name: label };
      data.datasets.forEach((ds) => { point[ds.label] = ds.data[i]; });
      return point;
    });
    return (
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="vertical" barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--analytics-grid-line))" />
          <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          {data.datasets.map((ds) => (
            <Bar key={ds.label} dataKey={ds.label}
              fill={DATASET_COLORS[ds.label]?.stroke ?? "hsl(var(--primary))"}
              radius={[0, 4, 4, 0]} opacity={ds.label === "Average" ? 1 : 0.5}
            />
          ))}
          <Tooltip contentStyle={CustomTooltipStyle} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderDoughnut = (data: AggregateChartResult["data"]) => {
    const chartData = data.labels.map((label, i) => ({
      name: label, value: data.datasets[0].data[i],
    }));
    return (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius="55%" outerRadius="80%"
            paddingAngle={3} dataKey="value" strokeWidth={0}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={DOUGHNUT_COLORS[i % DOUGHNUT_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={CustomTooltipStyle} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderScore = (data: AggregateChartResult["data"]) => {
    const avg = data.datasets.find(d => d.label === "Average")?.data[0] ?? 0;
    const max = data.datasets.find(d => d.label === "Max")?.data[0];
    const min = data.datasets.find(d => d.label === "Min")?.data[0];
    return (
      <div className={`flex flex-col items-center justify-center gap-4 ${isPrimary ? "h-[360px]" : "h-[280px]"}`}>
        <div className="relative">
          <div className={`font-bold text-foreground ${isPrimary ? "text-7xl" : "text-6xl"}`}>{avg}</div>
          <div className="absolute -top-2 -right-6 text-sm text-muted-foreground font-medium">/100</div>
        </div>
        {(min !== undefined || max !== undefined) && (
          <div className="flex gap-6 text-sm text-muted-foreground">
            {min !== undefined && <span>Min: <span className="font-semibold text-accent">{min}</span></span>}
            {max !== undefined && <span>Max: <span className="font-semibold text-interu-mint">{max}</span></span>}
          </div>
        )}
      </div>
    );
  };

  const renderLine = (data: AggregateChartResult["data"]) => {
    const chartData = data.labels.map((label, i) => {
      const point: Record<string, string | number> = { name: label };
      data.datasets.forEach((ds) => { point[ds.label] = ds.data[i]; });
      return point;
    });
    return (
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--analytics-grid-line))" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          {data.datasets.map((ds) => (
            <Line key={ds.label} type="monotone" dataKey={ds.label}
              stroke={DATASET_COLORS[ds.label]?.stroke ?? "hsl(var(--primary))"}
              strokeWidth={ds.label === "Average" ? 2.5 : 1.5}
              dot={{ r: 3 }} activeDot={{ r: 5 }}
            />
          ))}
          <Tooltip contentStyle={CustomTooltipStyle} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderArea = (data: AggregateChartResult["data"]) => {
    const chartData = data.labels.map((label, i) => {
      const point: Record<string, string | number> = { name: label };
      data.datasets.forEach((ds) => { point[ds.label] = ds.data[i]; });
      return point;
    });
    return (
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--analytics-grid-line))" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          {data.datasets.map((ds) => (
            <Area key={ds.label} type="monotone" dataKey={ds.label}
              stroke={DATASET_COLORS[ds.label]?.stroke ?? "hsl(var(--primary))"}
              fill={DATASET_COLORS[ds.label]?.fill ?? "hsl(var(--primary) / 0.1)"}
              strokeWidth={ds.label === "Average" ? 2.5 : 1.5}
            />
          ))}
          <Tooltip contentStyle={CustomTooltipStyle} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: isPrimary ? 30 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index, ease: "easeOut" }}
      className={`group relative overflow-hidden transition-all duration-300 ${
        isWide ? "col-span-full" : ""
      } ${
        isPrimary
          ? "rounded-2xl border border-border/40 bg-card shadow-md hover:shadow-lg"
          : "rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm hover:shadow-md hover:border-border/80"
      }`}
    >
      {/* Accent line — only on primary */}
      {isPrimary && (
        <div
          className="h-[3px] w-full"
          style={{
            background: `linear-gradient(90deg, hsl(var(--analytics-accent-1)), hsl(var(--analytics-accent-2)))`,
            opacity: 0.6,
          }}
        />
      )}

      <div className={isPrimary ? "p-6 md:p-8" : "p-5 md:p-6"}>
        <div className={isPrimary ? "mb-6" : "mb-4"}>
          <h3 className={`font-semibold text-foreground ${isPrimary ? "text-lg" : "text-base"}`}>
            {chart.chart_name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {chart.data.datasets.length} dataset{chart.data.datasets.length > 1 ? "s" : ""} · {chart.data.labels.length} categories
          </p>
        </div>
        {renderChart()}
      </div>
    </motion.div>
  );
};

export default DynamicChartCard;
