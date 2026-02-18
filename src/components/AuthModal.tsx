import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
  onSuccess?: () => void;
}

const MIN_PASSWORD_LENGTH = 6;

const AuthModal = ({ isOpen, onClose, defaultTab = "login", onSuccess }: AuthModalProps) => {
  const { login, register, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign up form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Reset to defaultTab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      await login(loginEmail, loginPassword);
      onSuccess?.();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      // Clean up error message (remove "API error 401:" prefix if present)
      const cleanMessage = message.replace(/^API error \d+:\s*/, "");
      setLoginError(cleanMessage || "Invalid email or password");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    // Client-side validation: password must be at least 6 characters
    if (signupPassword.length < MIN_PASSWORD_LENGTH) {
      setSignupError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    try {
      await register(signupEmail, signupPassword, signupName || undefined);
      onSuccess?.();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      // Clean up error message (remove "API error XXX:" prefix if present)
      const cleanMessage = message.replace(/^API error \d+:\s*/, "");
      setSignupError(cleanMessage || "Registration failed. Please try again.");
    }
  };

  const resetForms = () => {
    setLoginEmail("");
    setLoginPassword("");
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    setLoginError("");
    setSignupError("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForms();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl sm:border-border/50">
        {/* Header with Logo */}
        <DialogHeader className="p-6 pb-4 text-center flex-shrink-0">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground tracking-tight">
              Napster Connect
            </span>
          </div>
          <DialogTitle className="text-lg font-medium text-foreground">
            {activeTab === "login" ? "Welcome back" : "Create your account"}
          </DialogTitle>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="px-6 flex-shrink-0">
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
        </div>

        {/* Forms */}
        <div className="p-6 pt-4 flex-1 overflow-y-auto">
          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4 flex flex-col h-full">
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
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setLoginError("");
                  }}
                  required
                  className="h-11 bg-muted/50 border-border/50 focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="flex-1" />
              <PrimaryButton
                type="submit"
                disabled={isLoading}
                className="w-full h-11 font-medium mt-auto"
              >
                {isLoading ? "Logging in..." : "Log in"}
              </PrimaryButton>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4 flex flex-col h-full">
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
                  placeholder="••••••••"
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
              <div className="flex-1" />
              <PrimaryButton
                type="submit"
                disabled={isLoading}
                className="w-full h-11 font-medium mt-auto"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </PrimaryButton>
            </form>
          )}
        </div>

        {/* Footer text - sticky at bottom on mobile */}
        <div className="flex-shrink-0 p-4 pt-0 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-4">
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
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
