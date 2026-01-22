import { useEffect, useRef, useState } from "react";
import { Mic, Link2, MessageCircle, BarChart2 } from "lucide-react";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const steps: Step[] = [
  {
    icon: <Mic className="w-6 h-6" />,
    title: "Create an interview by voice",
    description: "Simply dictate your questions and our AI agent recognizes and structures them automatically.",
    color: "text-primary",
    bgColor: "bg-interu-blue-light",
  },
  {
    icon: <Link2 className="w-6 h-6" />,
    title: "Get a link and share it",
    description: "Generate a unique interview link that you can share with any number of participants.",
    color: "text-interu-mint",
    bgColor: "bg-interu-mint-light",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Participant answers the questions",
    description: "Participants use the link to answer questions via voice in a natural, conversational way.",
    color: "text-interu-coral",
    bgColor: "bg-interu-coral-light",
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: "Your Dashboard shows the result",
    description: "View comprehensive summaries with sentiment analysis and insights from all responses.",
    color: "text-interu-purple",
    bgColor: "bg-interu-purple-light",
  },
];

const HowItWorksSection = () => {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = stepRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1 && !visibleSteps.includes(index)) {
              setVisibleSteps((prev) => [...prev, index]);
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: "-50px" }
    );

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [visibleSteps]);

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-card">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-interu-blue-light text-primary text-sm font-medium mb-4">
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
            Four simple steps to <span className="text-primary">better interviews</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From creation to insights in minutes. Our streamlined process makes voice-based interviews effortless.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

          {steps.map((step, index) => {
            const isVisible = visibleSteps.includes(index);
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                ref={(el) => { stepRefs.current[index] = el; }}
                className={`relative flex items-center gap-6 md:gap-12 mb-12 md:mb-16 last:mb-0 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Step Number Circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`flex items-center justify-center w-16 h-16 rounded-full ${step.bgColor} border-4 border-card shadow-md transition-all duration-500 ${
                      isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"
                    }`}
                  >
                    <span className={`${step.color}`}>{step.icon}</span>
                  </div>
                </div>

                {/* Content Card */}
                <div
                  className={`flex-1 glass-card rounded-2xl p-6 md:p-8 shadow-card transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : isEven
                      ? "opacity-0 -translate-x-10"
                      : "opacity-0 translate-x-10"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-semibold text-muted-foreground">
                      Step {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
