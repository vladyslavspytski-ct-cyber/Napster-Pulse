import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Clock, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const currentPlan = {
  name: "Starter",
  price: "$0",
  period: "/mo",
  renewalDate: "Mar 11, 2026",
  features: [
    "3 interviews per month",
    "Basic question templates",
    "5-minute sessions",
    "Email support",
  ],
};

const upgradeTiers = [
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    tagline: "Most popular",
    popular: true,
    highlights: ["Unlimited interviews", "30-min sessions", "AI insights", "Priority support"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    tagline: "For teams",
    popular: false,
    highlights: ["Everything in Pro", "Custom integrations", "SSO", "Dedicated manager"],
  },
];

const invoices = [
  { id: "INV-001", date: "Feb 1, 2026", amount: "$0.00" },
  { id: "INV-002", date: "Jan 1, 2026", amount: "$0.00" },
  { id: "INV-003", date: "Dec 1, 2025", amount: "$0.00" },
];

const MyPlanV3 = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="section-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header banner */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-8 md:p-10 mb-10 relative overflow-hidden"
          >
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-[hsl(var(--interu-purple))]/5 pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <Badge variant="secondary" className="mb-3 text-xs">
                  <Clock className="w-3 h-3 mr-1" /> Renews {currentPlan.renewalDate}
                </Badge>
                <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">
                  {currentPlan.name} Plan
                </h1>
                <p className="text-muted-foreground text-sm">
                  You're on the free plan. Upgrade to unlock more.
                </p>
              </div>

              <div className="text-left md:text-right">
                <span className="text-5xl font-bold text-foreground">{currentPlan.price}</span>
                <span className="text-muted-foreground text-sm ml-1">{currentPlan.period}</span>
              </div>
            </div>

            <div className="relative mt-6 pt-6 border-t border-border">
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currentPlan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Upgrade section — horizontal stacked bars */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Upgrade your plan
            </h2>

            <div className="space-y-4">
              {upgradeTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`glass-card rounded-2xl p-6 md:p-8 ${
                    tier.popular ? "ring-2 ring-primary shadow-glow" : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Left */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                        <span className="text-xs text-muted-foreground bg-muted rounded-full px-3 py-0.5">
                          {tier.tagline}
                        </span>
                      </div>
                      <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
                        {tier.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Check className="w-3.5 h-3.5 text-primary" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        <span className="text-2xl font-bold text-foreground">{tier.price}</span>
                        {tier.period && (
                          <span className="text-muted-foreground text-sm ml-1">{tier.period}</span>
                        )}
                      </div>
                      {tier.popular ? (
                        <PrimaryButton className="gap-2 whitespace-nowrap">
                          Upgrade <ArrowRight className="w-4 h-4" />
                        </PrimaryButton>
                      ) : (
                        <Button variant="outline" className="gap-2 whitespace-nowrap">
                          Contact Sales <ArrowRight className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Invoices — minimal list */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Billing history
            </h2>

            <div className="glass-card rounded-2xl divide-y divide-border">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between px-6 py-4 text-sm">
                  <div className="flex items-center gap-6">
                    <span className="font-medium text-foreground w-20">{inv.id}</span>
                    <span className="text-muted-foreground">{inv.date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-foreground">{inv.amount}</span>
                    <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyPlanV3;
