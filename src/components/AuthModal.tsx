import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
  onSuccess?: () => void;
}

const AuthModal = ({ isOpen, onClose, defaultTab = "login", onSuccess }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Test credentials
  const TEST_EMAIL = "testuser@example.com";
  const TEST_PASSWORD = "password123";

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign up form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate against test credentials
    if (loginEmail === TEST_EMAIL && loginPassword === TEST_PASSWORD) {
      setIsLoading(false);
      onSuccess?.();
      onClose();
    } else {
      setIsLoading(false);
      setLoginError("Invalid email or password");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate signup - replace with actual auth logic later
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    onSuccess?.();
    onClose();
  };

  const resetForms = () => {
    setLoginEmail("");
    setLoginPassword("");
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    setLoginError("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForms();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/50">
        {/* Header with Logo */}
        <DialogHeader className="p-6 pb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground tracking-tight">
              Interu
            </span>
          </div>
          <DialogTitle className="text-lg font-medium text-foreground">
            {activeTab === "login" ? "Welcome back" : "Create your account"}
          </DialogTitle>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="px-6">
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
        <div className="p-6 pt-4">
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
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 btn-gradient border-0 font-medium"
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
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
                  onChange={(e) => setSignupEmail(e.target.value)}
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
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  className="h-11 bg-muted/50 border-border/50 focus:border-primary/50 transition-colors"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 btn-gradient border-0 font-medium"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          )}

          {/* Footer text */}
          <p className="mt-4 text-center text-xs text-muted-foreground">
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
