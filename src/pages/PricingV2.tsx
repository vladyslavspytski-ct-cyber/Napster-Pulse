import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const tiers = [
  {
    name: "Starter",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Explore voice interviews at zero cost.",
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: 29,
    yearlyPrice: 24,
    description: "For teams running regular workflows.",
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    description: "Custom pricing for large organisations.",
    cta: "Contact Sales",
    popular: false,
  },
];

const features = [
  { label: "Interviews per month", values: ["3", "Unlimited", "Unlimited"] },
  { label: "Session length", values: ["5 min", "30 min", "Unlimited"] },
  { label: "Question templates", values: ["Basic", "Custom", "Custom"] },
  { label: "AI-powered insights", values: [false, true, true] },
  { label: "Team collaboration", values: [false, true, true] },
  { label: "Priority support", values: [false, true, true] },
  { label: "Custom integrations", values: [false, false, true] },
  { label: "SSO & security", values: [false, false, true] },
  { label: "Dedicated account manager", values: [false, false, true] },
];

const PricingV2 = () => {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        {/* Hero */}
        <div className="section-container text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4"
          >
            Plans that grow with you
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-muted-foreground text-lg max-w-md mx-auto mb-8"
          >
            No surprises. Switch or cancel anytime.
          </motion.p>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-3 rounded-full bg-muted p-1"
          >
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                !yearly ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                yearly ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Yearly
              <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
                Save 17%
              </Badge>
            </button>
          </motion.div>
        </div>

        {/* Price cards — compact row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="section-container max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 px-4 sm:px-6 lg:px-8 mb-16"
        >
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`glass-card rounded-2xl p-6 text-center flex flex-col items-center ${
                t.popular ? "ring-2 ring-primary shadow-glow" : ""
              }`}
            >
              {t.popular && (
                <Badge className="btn-gradient text-primary-foreground text-xs border-0 mb-3">
                  <Zap className="w-3 h-3 mr-1" /> Most popular
                </Badge>
              )}
              <h3 className="text-lg font-semibold text-foreground">{t.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">{t.description}</p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={yearly ? "y" : "m"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="mb-5"
                >
                  {t.monthlyPrice !== null ? (
                    <span className="text-3xl font-bold text-foreground">
                      ${yearly ? t.yearlyPrice : t.monthlyPrice}
                      <span className="text-sm font-normal text-muted-foreground"> /mo</span>
                    </span>
                  ) : (
                    <span className="text-3xl font-bold text-foreground">Custom</span>
                  )}
                </motion.div>
              </AnimatePresence>

              {t.popular ? (
                <PrimaryButton className="w-full">{t.cta}</PrimaryButton>
              ) : (
                <Button variant="outline" className="w-full">
                  {t.cta}
                </Button>
              )}
            </div>
          ))}
        </motion.div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="section-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Compare features
          </h2>

          <div className="glass-card rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-border bg-muted/40">
              <span className="text-sm font-medium text-muted-foreground">Feature</span>
              {tiers.map((t) => (
                <span key={t.name} className="text-sm font-semibold text-foreground text-center">
                  {t.name}
                </span>
              ))}
            </div>

            {features.map((f, i) => (
              <div
                key={f.label}
                className={`grid grid-cols-4 gap-4 px-6 py-3.5 text-sm ${
                  i < features.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <span className="text-muted-foreground">{f.label}</span>
                {f.values.map((v, j) => (
                  <span key={j} className="text-center flex justify-center items-center">
                    {typeof v === "boolean" ? (
                      v ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/40" />
                      )
                    ) : (
                      <span className="text-foreground font-medium">{v}</span>
                    )}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingV2;
