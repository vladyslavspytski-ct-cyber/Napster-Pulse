import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface AnimatedKPIProps {
  value: number;
  label?: string;
  duration?: number;
}

const AnimatedKPI = ({ value, label = "Overall Score", duration = 1.8 }: AnimatedKPIProps) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  const circumference = 2 * Math.PI * 54;
  const strokeDash = (display / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center gap-3"
    >
      <div className="relative w-36 h-36 md:w-44 md:h-44">
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-30"
          style={{ background: "hsl(var(--analytics-kpi-glow))" }}
        />
        <svg viewBox="0 0 120 120" className="w-full h-full relative z-10">
          {/* Track */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="6"
          />
          {/* Progress */}
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="url(#kpiGradient)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - strokeDash}
            transform="rotate(-90 60 60)"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - strokeDash }}
            transition={{ duration: duration, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="kpiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--analytics-accent-1))" />
              <stop offset="100%" stopColor="hsl(var(--analytics-accent-2))" />
            </linearGradient>
          </defs>
          {/* Score text */}
          <text
            x="60"
            y="56"
            textAnchor="middle"
            className="fill-foreground"
            style={{ fontSize: "28px", fontWeight: 700 }}
          >
            {display}
          </text>
          <text
            x="60"
            y="74"
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ fontSize: "10px", fontWeight: 500 }}
          >
            / 100
          </text>
        </svg>
      </div>
      <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
        {label}
      </span>
    </motion.div>
  );
};

export default AnimatedKPI;
