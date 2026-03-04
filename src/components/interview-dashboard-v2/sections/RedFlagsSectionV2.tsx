import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, AlertCircle } from "lucide-react";

interface RedFlagInput {
  issue: string;
  impact?: string;
  severity?: string;
  details?: string;
  frequency?: number;
  occurrences?: number;
}

interface RedFlagsSectionV2Props {
  data: RedFlagInput[];
}

const getSeverity = (flag: RedFlagInput): string => {
  const level = flag.severity ?? flag.impact ?? "medium";
  return level.toLowerCase();
};

const SEVERITY_STYLES: Record<string, { bg: string; border: string; icon: string; badge: string; badgeBg: string }> = {
  high: {
    bg: "hsl(var(--destructive) / 0.06)",
    border: "hsl(var(--destructive) / 0.18)",
    icon: "hsl(var(--destructive))",
    badge: "hsl(var(--destructive))",
    badgeBg: "hsl(var(--destructive) / 0.12)",
  },
  critical: {
    bg: "hsl(var(--destructive) / 0.08)",
    border: "hsl(var(--destructive) / 0.22)",
    icon: "hsl(var(--destructive))",
    badge: "hsl(var(--destructive))",
    badgeBg: "hsl(var(--destructive) / 0.15)",
  },
  medium: {
    bg: "hsl(var(--accent) / 0.06)",
    border: "hsl(var(--accent) / 0.18)",
    icon: "hsl(var(--accent))",
    badge: "hsl(var(--accent))",
    badgeBg: "hsl(var(--accent) / 0.12)",
  },
  low: {
    bg: "hsl(var(--interu-mint) / 0.06)",
    border: "hsl(var(--interu-mint) / 0.18)",
    icon: "hsl(var(--interu-mint))",
    badge: "hsl(var(--interu-mint))",
    badgeBg: "hsl(var(--interu-mint) / 0.12)",
  },
};

const getStyle = (severity: string) =>
  SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.medium;

const SeverityIcon = ({ severity }: { severity: string }) => {
  if (severity === "high" || severity === "critical")
    return <ShieldAlert className="w-4 h-4" />;
  if (severity === "low") return <AlertCircle className="w-4 h-4" />;
  return <AlertTriangle className="w-4 h-4" />;
};

export const RedFlagsSectionV2 = ({ data }: RedFlagsSectionV2Props) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  return (
    <section className="py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 mb-6"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "hsl(var(--destructive) / 0.1)" }}
        >
          <AlertTriangle className="w-4 h-4" style={{ color: "hsl(var(--destructive))" }} />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Red Flags</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data.map((f, i) => {
          const severity = getSeverity(f);
          const style = getStyle(severity);
          const occurrences = f.occurrences ?? f.frequency;

          return (
            <motion.div
              key={`${f.issue}-${i}`}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="group relative rounded-2xl p-4 cursor-default transition-shadow"
              style={{
                backgroundColor: style.bg,
                border: `1px solid ${style.border}`,
              }}
            >
              {/* Top: badge + occurrences */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: style.badge, backgroundColor: style.badgeBg }}
                >
                  <SeverityIcon severity={severity} />
                  {f.impact ?? f.severity ?? "Medium"}
                </span>
                {occurrences !== undefined && (
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {occurrences}×
                  </span>
                )}
              </div>

              {/* Issue */}
              <p className="text-sm font-medium text-foreground leading-snug">{f.issue}</p>

              {/* Details */}
              {f.details && (
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
                  {f.details}
                </p>
              )}

              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: `0 6px 24px ${style.bg}` }}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default RedFlagsSectionV2;
