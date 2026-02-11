import { motion } from "framer-motion";
import { Check, CreditCard, FileText, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const currentPlan = {
  name: "Starter",
  price: "$0",
  period: "/ month",
  renewalDate: "Mar 11, 2026",
  features: [
    "3 interviews per month",
    "Basic question templates",
    "5-minute sessions",
    "Email support",
  ],
};

const availablePlans = [
  {
    name: "Pro",
    price: "$29",
    period: "/ month",
    highlight: "Most popular",
    features: [
      "Unlimited interviews",
      "Custom question sets",
      "30-minute sessions",
      "AI-powered insights",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    highlight: null,
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Unlimited session length",
      "Dedicated account manager",
    ],
  },
];

const invoices = [
  { id: "INV-001", date: "Feb 1, 2026", amount: "$0.00", status: "Paid" },
  { id: "INV-002", date: "Jan 1, 2026", amount: "$0.00", status: "Paid" },
  { id: "INV-003", date: "Dec 1, 2025", amount: "$0.00", status: "Paid" },
];

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const MyPlan = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="section-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Plan & Billing</h1>
            <p className="text-muted-foreground mt-1">Manage your subscription and billing details.</p>
          </motion.div>

          {/* Current Plan */}
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            className="glass-card rounded-2xl p-6 md:p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Current Plan</h2>
                  <p className="text-xs text-muted-foreground">Renews {currentPlan.renewalDate}</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">{currentPlan.name}</Badge>
            </div>

            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-foreground">{currentPlan.price}</span>
              {currentPlan.period && <span className="text-muted-foreground text-sm">{currentPlan.period}</span>}
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentPlan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Available Plans */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Upgrade Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availablePlans.map((plan) => (
                <div
                  key={plan.name}
                  className="glass-card rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">{plan.name}</h3>
                      {plan.highlight && (
                        <Badge className="btn-gradient text-primary-foreground text-xs border-0">
                          {plan.highlight}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                    </div>

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <PrimaryButton className="w-full gap-2">
                    Switch to {plan.name} <ArrowRight className="w-4 h-4" />
                  </PrimaryButton>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Billing History */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Billing History</h2>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="hidden sm:grid grid-cols-4 gap-4 px-6 py-3 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <span>Invoice</span>
                <span>Date</span>
                <span>Amount</span>
                <span>Status</span>
              </div>
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 px-6 py-4 border-b border-border last:border-0 text-sm"
                >
                  <span className="font-medium text-foreground">{inv.id}</span>
                  <span className="text-muted-foreground">{inv.date}</span>
                  <span className="text-foreground">{inv.amount}</span>
                  <Badge variant="secondary" className="w-fit text-xs">{inv.status}</Badge>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              Need help? <Button variant="link" className="text-xs p-0 h-auto">Contact support</Button>
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyPlan;
