/**
 * ElectronWelcome - Welcome screen for Electron app (replaces landing page)
 *
 * Shown to users who are not logged in when running in Electron mode.
 * Provides a clean, focused entry point without marketing content.
 */

import { Mic, ArrowRight } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { isMacOS } from "@/lib/electron";

interface ElectronWelcomeProps {
  onLogin: () => void;
  onSignup: () => void;
}

const ElectronWelcome = ({ onLogin, onSignup }: ElectronWelcomeProps) => {
  // On macOS, leave space for window controls (traffic lights)
  const isMac = isMacOS();

  // Debug: log detection result
  console.log('[ElectronWelcome] isMacOS:', isMac, 'userAgent:', navigator.userAgent.substring(0, 50));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Simple header with logo and theme toggle - draggable for window movement */}
      <header
        className={`flex items-center justify-between border-b border-border ${
          isMac ? "h-20 pt-6" : "h-14 px-6"
        }`}
        style={{
          WebkitAppRegion: 'drag',
          paddingLeft: isMac ? '96px' : '24px',
          paddingRight: '24px',
        } as React.CSSProperties}
      >
        <div
          className="flex items-center gap-2"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
            <Mic className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground tracking-tight">
            Napster Pulse
          </span>
        </div>
        <div style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content - centered welcome */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
                <Mic className="w-12 h-12 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Welcome text */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome to Napster Pulse
            </h1>
            <p className="text-muted-foreground text-lg">
              Create AI-powered voice interviews and gather insights at scale.
              Sign in to get started.
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <PrimaryButton
              onClick={onLogin}
              className="w-full h-12 text-base font-medium"
            >
              Sign in to continue
            </PrimaryButton>
            <Button
              variant="outline"
              onClick={onSignup}
              className="w-full h-12 text-base font-medium"
            >
              Create new account
            </Button>
          </div>

          {/* Footer links */}
          <div className="text-sm text-muted-foreground">
            <p>
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
        </div>
      </main>

      {/* Version info */}
      <footer className="px-6 py-3 text-center text-xs text-muted-foreground border-t border-border">
        Napster Pulse Desktop
      </footer>
    </div>
  );
};

export default ElectronWelcome;
