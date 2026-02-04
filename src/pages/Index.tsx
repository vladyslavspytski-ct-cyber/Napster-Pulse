import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ProductPreviewSection from "@/components/ProductPreviewSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { isLoggedIn } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleCreateInterview = () => {
    if (isLoggedIn) {
      // Already logged in - navigate directly
      window.location.href = "/create-interview";
    } else {
      // Not logged in - open login modal (will redirect after success)
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    // After auth, redirect to create interview
    window.location.href = "/create-interview";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection onCreateInterview={handleCreateInterview} />
        <HowItWorksSection />
        <ProductPreviewSection />
        <CTASection onCreateInterview={handleCreateInterview} />
      </main>
      <Footer />

      {/* Auth Modal for CTA buttons - defaults to login mode */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="login"
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
