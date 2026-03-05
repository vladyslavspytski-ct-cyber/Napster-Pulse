/**
 * ElectronAuth - Fullscreen authentication page for Electron app
 *
 * Clean, centered login/signup form without modal overlay.
 * Uses the same auth logic as AuthModal but in fullscreen layout.
 */

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mic, ArrowLeft } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { isMacOS } from "@/lib/electron";

const MIN_PASSWORD_LENGTH = 6;

interface LocationState {
  redirectTo?: string;
  defaultTab?: "login" | "signup";
}

const ElectronAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const { login, register, isLoading, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">(
    state?.defaultTab || "login"
  );
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign up form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      const redirectTo = state?.redirectTo || "/dashboard";
      navigate(redirectTo, { replace: true });
    }
  }, [isLoggedIn, navigate, state?.redirectTo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      await login(loginEmail, loginPassword);
      const redirectTo = state?.redirectTo || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      const cleanMessage = message.replace(/^API error \d+:\s*/, "");
      setLoginError(cleanMessage || "Invalid email or password");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    if (signupPassword.length < MIN_PASSWORD_LENGTH) {
      setSignupError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    try {
      await register(signupEmail, signupPassword, signupName || undefined);
      const redirectTo = state?.redirectTo || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      const cleanMessage = message.replace(/^API error \d+:\s*/, "");
      setSignupError(cleanMessage || "Registration failed. Please try again.");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  // On macOS, leave space for window controls (traffic lights)
  const isMac = isMacOS();

  // Debug: log detection result
  console.log('[ElectronAuth] isMacOS:', isMac);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - draggable for window movement */}
      <header
        className={`flex items-center justify-between border-b border-border ${
          isMac ? "h-20 pt-6" : "h-14"
        }`}
        style={{
          WebkitAppRegion: 'drag',
          paddingLeft: isMac ? '96px' : '24px',
          paddingRight: '24px',
        } as React.CSSProperties}
      >
        <div style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        <div style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo and title */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
                <Mic className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-semibold text-foreground tracking-tight">
                Napster Pulse
              </span>
            </div>
            <h1 className="text-xl font-medium text-foreground">
              {activeTab === "login" ? "Welcome back" : "Create your account"}
            </h1>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-muted rounded-xl p-1">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === "login"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === "signup"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Forms */}
          <div>
            {activeTab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                    {loginError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      setLoginError("");
                    }}
                    required
                    className="h-11 bg-muted/50 border-border/50 focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginError("");
                    }}
                    required
                    className="h-11 bg-muted/50 border-border/50 focus:border-primary/50 transition-colors"
                  />
                </div>
                <PrimaryButton
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 font-medium"
                >
                  {isLoading ? "Logging in..." : "Log in"}
                </PrimaryButton>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                {signupError && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                    {signupError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-sm font-medium">
                    Name
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => {
                      setSignupName(e.target.value);
                      setSignupError("");
                    }}
                    className="h-11 bg-muted/50 border-border/50 focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@example.com"
                    value={signupEmail}
                    onChange={(e) => {
                      setSignupEmail(e.target.value);
                      setSignupError("");
                    }}
                    required
                    className="h-11 bg-muted/50 border-border/50 focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value);
                      setSignupError("");
                    }}
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                    className="h-11 bg-muted/50 border-border/50 focus:border-primary/50 transition-colors"
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least {MIN_PASSWORD_LENGTH} characters
                  </p>
                </div>
                <PrimaryButton
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 font-medium"
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </PrimaryButton>
              </form>
            )}
          </div>

          {/* Footer links */}
          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline hover:text-foreground transition-colors">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-foreground transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ElectronAuth;
