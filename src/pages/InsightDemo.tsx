import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ConceptA from "@/components/insight-concepts/ConceptA";
import ConceptB from "@/components/insight-concepts/ConceptB";
import ConceptC from "@/components/insight-concepts/ConceptC";
import { DistributionChartSection } from "@/components/interview-dashboard/sections/DistributionChartSection";

const DISTRIBUTION_MOCK = {
  title: "Overall Performance Sentiment",
  labels: ["Strong Hire", "Hire", "Neutral", "No Hire"],
  values: [4, 0, 2, 0],
};

const CONCEPTS = [
  { key: "A", label: "Executive Brief", description: "Minimal, premium, strategic" },
  { key: "B", label: "AI Canvas", description: "Bold, expressive, dynamic" },
  { key: "C", label: "Analytics Studio", description: "Structured, analytical, layered" },
] as const;

type ConceptKey = (typeof CONCEPTS)[number]["key"];

const InsightDemo = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState<ConceptKey>("A");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        {/* Concept Switcher Bar */}
        <div className="section-container max-w-7xl mx-auto mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="-ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Results
            </Button>

            <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/50 border border-border/40">
              {CONCEPTS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setActive(c.key)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active === c.key
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground/70"
                  }`}
                >
                  {active === c.key && (
                    <motion.div
                      layoutId="concept-pill"
                      className="absolute inset-0 rounded-lg bg-card border border-border/50 shadow-sm"
                      transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                    />
                  )}
                  <span className="relative z-10">
                    <span className="font-bold mr-1.5">Concept {c.key}</span>
                    <span className="hidden md:inline text-xs text-muted-foreground">— {c.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Concept */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {active === "A" && <ConceptA />}
            {active === "B" && <ConceptB />}
            {active === "C" && <ConceptC />}
          </motion.div>
        </AnimatePresence>

        {/* Distribution Chart Exploration */}
        <div className="section-container max-w-7xl mx-auto mt-12 pt-12 border-t border-border/30">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2 px-1">Section Exploration</h3>
          <DistributionChartSection data={DISTRIBUTION_MOCK} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InsightDemo;
