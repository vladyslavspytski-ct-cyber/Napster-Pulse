import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface AnimatedKPIProps {
  value: number;
  label?: string;
  duration?: number;
}

const AnimatedKPI = ({ value, label = "Overall Score", duration = 1.8 }: AnimatedKPIProps) => {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / (duration * 1000), 1);
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
      className="flex flex-col items-center gap-4"
    >
      <div className="relative w-44 h-44 md:w-52 md:h-52">
        {/* Outer glow */}
        <div
          className="absolute inset-[-12px] rounded-full blur-3xl opacity-20"
          style={{ background: "hsl(var(--analytics-kpi-glow))" }}
        />
        {/* Inner subtle glow */}
        <div
          className="absolute inset-2 rounded-full blur-xl opacity-10"
          style={{ background: "hsl(var(--analytics-accent-2))" }}
        />
        <svg viewBox="0 0 120 120" className="w-full h-full relative z-10">
          {/* Track */}
          <circle cx="60" cy="60" r="54" fill="none"
            stroke="hsl(var(--border))" strokeWidth="5" opacity="0.5" />
          {/* Progress */}
          <motion.circle cx="60" cy="60" r="54" fill="none"
            stroke="url(#kpiGradient)" strokeWidth="7" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - strokeDash}
            transform="rotate(-90 60 60)"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - strokeDash }}
            transition={{ duration, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="kpiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--analytics-accent-1))" />
              <stop offset="100%" stopColor="hsl(var(--analytics-accent-2))" />
            </linearGradient>
          </defs>
          {/* Score */}
          <text x="60" y="55" textAnchor="middle" className="fill-foreground"
            style={{ fontSize: "32px", fontWeight: 700 }}>{display}</text>
          <text x="60" y="73" textAnchor="middle" className="fill-muted-foreground"
            style={{ fontSize: "10px", fontWeight: 500 }}>/ 100</text>
        </svg>
      </div>
      <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
        {label}
      </span>
    </motion.div>
  );
};

export default AnimatedKPI;
