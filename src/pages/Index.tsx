import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ProductPreviewSection from "@/components/ProductPreviewSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import ElectronWelcome from "@/components/electron/ElectronWelcome";
import { useAuth } from "@/hooks/useAuth";
import { useIsElectron } from "@/lib/electron";

const Index = () => {
  const { isLoggedIn } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const isDesktop = useIsElectron();
  const navigate = useNavigate();

  // In Electron mode, redirect logged-in users to dashboard
  useEffect(() => {
    if (isDesktop && isLoggedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isDesktop, isLoggedIn, navigate]);

  const handleCreateInterview = () => {
    if (isLoggedIn) {
      // Already logged in - navigate directly
      navigate("/create-interview");
    } else {
      // Not logged in - open login modal (will redirect after success)
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    // After auth, redirect to create interview
    navigate("/create-interview");
  };

  // Electron mode handlers for welcome screen
  const handleElectronLogin = () => {
    navigate("/electron-auth", { state: { defaultTab: "login" } });
  };

  const handleElectronSignup = () => {
    navigate("/electron-auth", { state: { defaultTab: "signup" } });
  };

  // Electron mode: show welcome screen for non-logged-in users
  if (isDesktop && !isLoggedIn) {
    return (
      <ElectronWelcome
        onLogin={handleElectronLogin}
        onSignup={handleElectronSignup}
      />
    );
  }

  // Web mode: show standard landing page
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
