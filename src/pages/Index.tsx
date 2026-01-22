import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ProductPreviewSection from "@/components/ProductPreviewSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("signup");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleCreateInterview = () => {
    if (!isLoggedIn) {
      setAuthModalTab("signup");
      setIsAuthModalOpen(true);
    } else {
      // Navigate to create interview page when logged in
      window.location.href = "/create-interview";
    }
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    // After auth, redirect to create interview
    window.location.href = "/create-interview";
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main>
        <HeroSection onCreateInterview={handleCreateInterview} />
        <HowItWorksSection />
        <ProductPreviewSection />
        <CTASection onCreateInterview={handleCreateInterview} />
      </main>
      <Footer />

      {/* Auth Modal for CTA buttons */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
