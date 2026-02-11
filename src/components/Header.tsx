import { useState, useRef } from "react";
import { Mic, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import AuthModal from "@/components/AuthModal";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");

  // Track pending redirect after login
  const pendingRedirectRef = useRef<string | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const openAuthModal = (tab: "login" | "signup", redirectAfterLogin?: string) => {
    setAuthModalTab(tab);
    pendingRedirectRef.current = redirectAfterLogin || null;
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleAuthSuccess = () => {
    // If there's a pending redirect, navigate there
    if (pendingRedirectRef.current) {
      window.location.href = pendingRedirectRef.current;
      pendingRedirectRef.current = null;
    }
  };

  // Protected pages that require redirect to home on logout
  const PROTECTED_PATHS = ["/create-interview", "/dashboard", "/saved-interviews"];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);

    // Redirect to home if on a protected page
    const currentPath = window.location.pathname;
    if (PROTECTED_PATHS.some((path) => currentPath.startsWith(path))) {
      window.location.href = "/";
    }
  };

  // Handle Dashboard click - if logged out, open login modal and redirect after
  const handleDashboardClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      openAuthModal("login", "/dashboard");
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - fixed width for balance */}
            <a href="/" className="flex items-center gap-2 group md:min-w-[140px]">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary transition-all duration-300 group-hover:shadow-glow">
                <Mic className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground tracking-tight">
                Interu
              </span>
            </a>

            {/* Desktop Navigation - centered */}
            <nav className="hidden md:flex items-center justify-center gap-6 flex-1">
              {/* How it works & Features - only visible on home page */}
              {window.location.pathname === "/" && (
                <>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    How it works
                  </button>
                  <button
                    onClick={() => scrollToSection("product-preview")}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </button>
                </>
              )}
              {/* Saved Interviews - only visible when logged in */}
              {isLoggedIn && (
                <a
                  href="/saved-interviews"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Saved Interviews
                </a>
              )}
              {/* Dashboard - gated with login modal */}
              <a
                href="/dashboard"
                onClick={handleDashboardClick}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
              {/* My Plan - only visible when logged in */}
              {isLoggedIn && (
                <a
                  href="/my-plan"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  My Plan
                </a>
              )}
            </nav>

            {/* Desktop Auth Buttons - fixed width for balance */}
            <div className="hidden md:flex items-center justify-end gap-3 md:min-w-[140px]">
              {isLoggedIn ? (
                <UserMenu onLogout={handleLogout} />
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => openAuthModal("login", "/saved-interviews")}>
                    Log in
                  </Button>
                  <PrimaryButton size="sm" onClick={() => openAuthModal("signup", "/saved-interviews")}>
                    Sign up
                  </PrimaryButton>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in">
              <nav className="flex flex-col gap-4">
                {/* How it works & Features - only visible on home page */}
                {window.location.pathname === "/" && (
                  <>
                    <button
                      onClick={() => scrollToSection("how-it-works")}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
                    >
                      How it works
                    </button>
                    <button
                      onClick={() => scrollToSection("product-preview")}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
                    >
                      Features
                    </button>
                  </>
                )}
                {/* Saved Interviews - only visible when logged in */}
                {isLoggedIn && (
                  <a
                    href="/saved-interviews"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Saved Interviews
                  </a>
                )}
                {/* Dashboard - gated with login modal */}
                <a
                  href="/dashboard"
                  onClick={handleDashboardClick}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="/pricing"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </a>
                {isLoggedIn && (
                  <a
                    href="/my-plan"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    My Plan
                  </a>
                )}
                <div className="flex gap-3 pt-4 border-t border-border">
                  {isLoggedIn ? (
                    <UserMenu onLogout={handleLogout} compact />
                  ) : (
                    <>
                      <Button variant="ghost" size="sm" className="flex-1" onClick={() => openAuthModal("login", "/saved-interviews")}>
                        Log in
                      </Button>
                      <PrimaryButton size="sm" className="flex-1" onClick={() => openAuthModal("signup", "/saved-interviews")}>
                        Sign up
                      </PrimaryButton>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          pendingRedirectRef.current = null;
        }}
        defaultTab={authModalTab}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default Header;
