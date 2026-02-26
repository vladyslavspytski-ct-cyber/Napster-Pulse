import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const pop = (delay = 0) => ({
  initial: { opacity: 0, y: 24, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

// Backend sends { issue, impact, details, frequency }
// or could send { issue, severity, occurrences }
interface RedFlagInput {
  issue: string;
  impact?: string;
  severity?: string;
  details?: string;
  frequency?: number;
  occurrences?: number;
}

interface RedFlagsSectionProps {
  data: RedFlagInput[];
}

// Normalize severity/impact to standard format
const getSeverity = (flag: RedFlagInput): string => {
  const level = flag.severity ?? flag.impact ?? "medium";
  return level.toLowerCase();
};

// Get color based on severity
const getSeverityColor = (severity: string): string => {
  const lower = severity.toLowerCase();
  if (lower === "high" || lower === "critical") return "bg-destructive";
  if (lower === "medium") return "bg-accent";
  return "bg-muted-foreground/40";
};

export const RedFlagsSection = ({ data }: RedFlagsSectionProps) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  return (
    <section className="section-container max-w-6xl mx-auto py-16">
      <motion.div {...pop(0)} className="flex items-center gap-2 mb-8">
        <AlertTriangle className="w-5 h-5 text-accent" />
        <h2 className="text-xl font-bold text-foreground">Red Flags</h2>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((f, i) => {
          const severity = getSeverity(f);
          const occurrences = f.occurrences ?? f.frequency;
          return (
            <motion.div
              key={`${f.issue}-${i}`}
              {...pop(0.05 * i)}
              className="p-5 rounded-xl border border-border/40 bg-card space-y-3"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${getSeverityColor(severity)}`} />
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    severity === "high" || severity === "critical"
                      ? "text-destructive"
                      : severity === "medium"
                        ? "text-accent"
                        : "text-muted-foreground"
                  }`}
                >
                  {f.impact ?? f.severity ?? "Medium"}
                </span>
                {occurrences !== undefined && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {occurrences} {occurrences === 1 ? "occurrence" : "occurrences"}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-foreground">{f.issue}</p>
              {f.details && (
                <p className="text-xs text-muted-foreground leading-relaxed">{f.details}</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default RedFlagsSection;
