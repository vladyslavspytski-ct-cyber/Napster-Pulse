import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert } from "lucide-react";

// Backend sends { issue, impact, details, frequency }
interface RedFlagInput {
  issue: string;
  impact?: string;
  severity?: string;
  details?: string;
  frequency?: number;
  occurrences?: number;
}

interface RedFlagsSectionExpProps {
  data: RedFlagInput[];
}

// Color mapping based on severity/impact
const SEVERITY_STYLES = {
  high: {
    bg: "from-rose-500/20 via-red-500/10 to-transparent",
    border: "border-rose-400/40",
    badge: "bg-rose-500/20 text-rose-400",
    icon: "text-rose-400",
  },
  critical: {
    bg: "from-rose-500/20 via-red-500/10 to-transparent",
    border: "border-rose-400/40",
    badge: "bg-rose-500/20 text-rose-400",
    icon: "text-rose-400",
  },
  medium: {
    bg: "from-amber-500/20 via-orange-500/10 to-transparent",
    border: "border-amber-400/40",
    badge: "bg-amber-500/20 text-amber-400",
    icon: "text-amber-400",
  },
  low: {
    bg: "from-slate-500/15 via-gray-500/5 to-transparent",
    border: "border-slate-400/30",
    badge: "bg-slate-500/20 text-slate-400",
    icon: "text-slate-400",
  },
};

const getSeverityStyle = (flag: RedFlagInput) => {
  const level = (flag.severity ?? flag.impact ?? "medium").toLowerCase();
  if (level === "high" || level === "critical") return SEVERITY_STYLES.high;
  if (level === "medium") return SEVERITY_STYLES.medium;
  return SEVERITY_STYLES.low;
};

export const RedFlagsSectionExp = ({ data }: RedFlagsSectionExpProps) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  // Filter out items where impact is "None" (case-insensitive)
  const filteredData = data.filter((flag) => {
    const impact = flag.impact?.toLowerCase();
    return impact !== "none";
  });

  // If all items were filtered out, don't render the section
  if (filteredData.length === 0) return null;

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.02] via-transparent to-amber-500/[0.02]" />

      <div className="section-container max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Red Flags</h2>
            <p className="text-sm text-muted-foreground">Potential concerns identified in responses</p>
          </div>
        </motion.div>

        {/* Red flag cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredData.map((flag, i) => {
            const style = getSeverityStyle(flag);
            const occurrences = flag.occurrences ?? flag.frequency;

            return (
              <motion.div
                key={`${flag.issue}-${i}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, type: "spring" }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`
                  relative group
                  p-5 rounded-2xl
                  bg-gradient-to-br ${style.bg}
                  border ${style.border}
                  backdrop-blur-sm
                  transition-all duration-300
                `}
              >
                {/* Header with severity badge */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className={`w-4 h-4 ${style.icon}`} />
                    <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badge}`}>
                      {flag.impact ?? flag.severity ?? "Medium"}
                    </span>
                  </div>
                  {occurrences !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {occurrences} {occurrences === 1 ? "occurrence" : "occurrences"}
                    </span>
                  )}
                </div>

                {/* Issue text */}
                <p className="text-base font-medium text-foreground leading-relaxed">
                  {flag.issue}
                </p>

                {/* Details if available */}
                {flag.details && (
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    {flag.details}
                  </p>
                )}

                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${style.bg} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300 -z-10`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RedFlagsSectionExp;
