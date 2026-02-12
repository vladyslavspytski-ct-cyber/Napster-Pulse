import { motion } from "framer-motion";
import { Check, ArrowRight, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    tagline: "Free forever",
    description: "Perfect for trying out voice interviews. No credit card needed.",
    features: [
      "3 interviews per month",
      "Basic question templates",
      "5-minute sessions",
      "Email support",
    ],
    cta: "Get Started",
    accent: "from-[hsl(var(--interu-mint))] to-[hsl(var(--interu-mint-light))]",
    iconBg: "bg-[hsl(var(--interu-mint-light))]",
    iconColor: "text-[hsl(var(--interu-mint))]",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    tagline: "Most popular",
    description: "Everything you need for professional interview workflows.",
    features: [
      "Unlimited interviews",
      "Custom question sets",
      "30-minute sessions",
      "AI-powered insights",
      "Priority support",
      "Team collaboration",
    ],
    cta: "Start Free Trial",
    accent: "from-primary to-[hsl(var(--interu-purple))]",
    iconBg: "bg-[hsl(var(--interu-blue-light))]",
    iconColor: "text-primary",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    tagline: "Tailored to you",
    description: "Dedicated infrastructure, support, and unlimited everything.",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Unlimited session length",
      "Dedicated account manager",
      "SSO & advanced security",
      "Custom branding",
    ],
    cta: "Contact Sales",
    accent: "from-[hsl(var(--interu-purple))] to-[hsl(var(--interu-coral))]",
    iconBg: "bg-[hsl(var(--interu-purple-light))]",
    iconColor: "text-[hsl(var(--interu-purple))]",
  },
];

const PricingV3 = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        {/* Hero — editorial style */}
        <div className="section-container max-w-3xl mx-auto text-center mb-20 px-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4"
          >
            Pricing
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-5xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.1] mb-6"
          >
            Invest in better
            <br />
            conversations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Three simple tiers. Upgrade, downgrade, or cancel at any time.
          </motion.p>
        </div>

        {/* Stacked full-width plan sections */}
        <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.08 }}
              className="glass-card rounded-3xl overflow-hidden"
            >
              {/* Gradient accent bar */}
              <div className={`h-1 bg-gradient-to-r ${plan.accent}`} />

              <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-start gap-8">
                {/* Left: info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-3 py-1">
                      {plan.tagline}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-6 max-w-md">{plan.description}</p>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: price + CTA */}
                <div className="flex flex-col items-center md:items-end gap-4 md:min-w-[180px]">
                  <div className="text-right">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                    )}
                  </div>

                  {i === 1 ? (
                    <PrimaryButton className="w-full md:w-auto gap-2">
                      {plan.cta} <ArrowRight className="w-4 h-4" />
                    </PrimaryButton>
                  ) : (
                    <Button variant="outline" className="w-full md:w-auto gap-2">
                      {plan.cta} <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-20 px-4"
        >
          <div className="glass-card inline-flex items-center gap-3 rounded-full px-6 py-3">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Not sure which plan?{" "}
              <Button variant="link" className="text-sm p-0 h-auto">
                Talk to us
              </Button>
            </span>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingV3;
