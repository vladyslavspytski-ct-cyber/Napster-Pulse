import { ArrowRight, Mic } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

interface CTASectionProps {
  onCreateInterview?: () => void;
}

const CTASection = ({ onCreateInterview }: CTASectionProps) => {
  return (
    <section className="py-20 md:py-32 bg-card">
      <div className="section-container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-interu-purple p-8 md:p-16">
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-interu-coral/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-6">
              <Mic className="w-8 h-8 text-primary-foreground" />
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Ready to transform your interviews?
            </h2>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
              Join thousands of creators who are already using Interu to conduct smarter, more insightful voice-based interviews.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PrimaryButton 
                size="lg" 
                className="!bg-white !text-primary hover:!bg-white/90 !border-0 shadow-lg shadow-black/20 text-base h-12 px-8 group"
                onClick={onCreateInterview}
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </PrimaryButton>
              <SecondaryButton 
                size="lg" 
                className="!border-white !text-white hover:!bg-white/15 !bg-transparent text-base h-12 px-8"
              >
                Schedule Demo
              </SecondaryButton>
            </div>
            
            <p className="text-sm text-primary-foreground/60 mt-6">
              No credit card required · Free forever plan available
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
