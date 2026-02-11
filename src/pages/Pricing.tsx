import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/ month",
    description: "For individuals exploring voice interviews.",
    features: [
      "3 interviews per month",
      "Basic question templates",
      "5-minute sessions",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/ month",
    description: "For teams running regular interview workflows.",
    features: [
      "Unlimited interviews",
      "Custom question sets",
      "30-minute sessions",
      "AI-powered insights",
      "Priority support",
      "Team collaboration",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations needing full customization.",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Unlimited session length",
      "Dedicated account manager",
      "SSO & advanced security",
      "Custom branding",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    q: "Can I change my plan at any time?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — the Pro plan comes with a 14-day free trial. No credit card required to start.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. There are no long-term contracts. Cancel anytime from your account settings.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        {/* Hero */}
        <div className="section-container text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-primary mb-3"
          >
            Pricing
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4"
          >
            Simple, transparent pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-md mx-auto"
          >
            Choose the plan that fits your interview workflow. Upgrade anytime.
          </motion.p>
        </div>

        {/* Plan Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="section-container grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={item}
              className={`relative glass-card rounded-2xl p-8 flex flex-col ${
                plan.popular
                  ? "ring-2 ring-primary shadow-glow"
                  : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full btn-gradient px-3 py-1 text-xs font-medium text-primary-foreground">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </span>
              )}

              <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {plan.popular ? (
                <PrimaryButton className="w-full">{plan.cta}</PrimaryButton>
              ) : (
                <Button variant="outline" className="w-full">
                  {plan.cta}
                </Button>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ */}
        <div className="section-container max-w-2xl mx-auto mt-24 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-foreground">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
