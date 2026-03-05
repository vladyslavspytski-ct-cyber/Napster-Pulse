import { motion } from "framer-motion";
import { Check, CreditCard, ArrowRight, Receipt, CalendarDays } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ElectronPageWrapper from "@/components/electron/ElectronPageWrapper";
import { useIsElectron } from "@/lib/electron";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const currentPlan = {
  name: "Starter",
  price: "$0",
  period: "/mo",
  renewalDate: "Mar 11, 2026",
  usedInterviews: 1,
  totalInterviews: 3,
};

const upgradePlans = [
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    popular: true,
    features: ["Unlimited interviews", "30-min sessions", "AI insights", "Team collab"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    popular: false,
    features: ["Everything in Pro", "Custom integrations", "SSO", "Dedicated manager"],
  },
];

const invoices = [
  { id: "INV-001", date: "Feb 1, 2026", amount: "$0.00", status: "Paid" },
  { id: "INV-002", date: "Jan 1, 2026", amount: "$0.00", status: "Paid" },
];

const MyPlanV2 = () => {
  const isDesktop = useIsElectron();

  return (
    <ElectronPageWrapper>
    <div className={`min-h-screen flex flex-col bg-background ${isDesktop ? 'electron-page' : ''}`}>
      {!isDesktop && <Header />}

      <main className={`flex-1 ${isDesktop ? 'pt-6' : 'pt-24'} pb-16`}>
        <div className="section-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-foreground tracking-tight mb-2"
          >
            Your Plan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="text-muted-foreground mb-10"
          >
            Overview of your subscription, usage, and billing.
          </motion.p>

          {/* Two-column layout: current plan + usage */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
          >
            {/* Current plan */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Current Plan</h2>
                  <p className="text-xs text-muted-foreground">{currentPlan.name}</p>
                </div>
                <Badge variant="secondary" className="ml-auto text-xs">Active</Badge>
              </div>

              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-foreground">{currentPlan.price}</span>
                <span className="text-muted-foreground text-sm">{currentPlan.period}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="w-3.5 h-3.5" />
                Renews {currentPlan.renewalDate}
              </div>
            </div>

            {/* Usage */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-semibold text-foreground mb-4">Monthly Usage</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Interviews used</span>
                  <span className="font-medium text-foreground">
                    {currentPlan.usedInterviews} / {currentPlan.totalInterviews}
                  </span>
                </div>
                <Progress
                  value={(currentPlan.usedInterviews / currentPlan.totalInterviews) * 100}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {currentPlan.totalInterviews - currentPlan.usedInterviews} interviews remaining this cycle
                </p>
              </div>
            </div>
          </motion.div>

          {/* Upgrade */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Upgrade</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upgradePlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`glass-card rounded-2xl p-6 flex flex-col ${
                    plan.popular ? "ring-2 ring-primary shadow-glow" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{plan.name}</h3>
                    {plan.popular && (
                      <Badge className="btn-gradient text-primary-foreground text-xs border-0">
                        Recommended
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {plan.popular ? (
                    <PrimaryButton className="w-full gap-2">
                      Upgrade <ArrowRight className="w-4 h-4" />
                    </PrimaryButton>
                  ) : (
                    <Button variant="outline" className="w-full gap-2">
                      Contact Sales <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Billing History — compact */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Receipt className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Invoices</h2>
            </div>

            <div className="glass-card rounded-2xl divide-y divide-border">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground">{inv.id}</span>
                    <span className="text-sm text-muted-foreground">{inv.date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground">{inv.amount}</span>
                    <Badge variant="secondary" className="text-xs">{inv.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {!isDesktop && <Footer />}
    </div>
    </ElectronPageWrapper>
  );
};

export default MyPlanV2;
