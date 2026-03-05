/**
 * ElectronTopbar - Top toolbar for Electron app
 *
 * Displays page title and user actions (theme toggle, user menu).
 * Designed to work with ElectronSidebar for desktop navigation.
 */

import { useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { isMacOS } from "@/lib/electron";

// Map paths to page titles
const getPageTitle = (pathname: string): string => {
  // Handle dynamic routes
  if (pathname.startsWith("/dashboard/interview/")) {
    return "Interview Analysis";
  }
  if (pathname.startsWith("/templates/")) {
    return "Templates";
  }

  const titles: Record<string, string> = {
    "/": "Home",
    "/dashboard": "Results",
    "/saved-interviews": "Library",
    "/templates": "Templates",
    "/create-interview": "Create Interview",
    "/my-plan": "My Plan",
    "/pricing": "Pricing",
    "/terms": "Terms of Service",
    "/privacy": "Privacy Policy",
    "/contact": "Contact",
  };

  return titles[pathname] || "Napster Pulse";
};

interface ElectronTopbarProps {
  onLogout: () => void;
}

const ElectronTopbar = ({ onLogout }: ElectronTopbarProps) => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const pageTitle = getPageTitle(location.pathname);

  // On macOS, leave space for window controls (traffic lights)
  const isMac = isMacOS();
  // Match sidebar header height: h-20 (80px) on macOS, h-14 (56px) on other platforms
  const headerHeight = isMac ? "h-20 pt-6" : "h-14";

  return (
    <header
      className={`${headerHeight} bg-background border-b border-border flex items-center justify-between px-4`}
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Page title */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
      </div>

      {/* Actions - no-drag for interactive elements */}
      <div
        className="flex items-center gap-2"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <ThemeToggle />
        {isLoggedIn && <UserMenu onLogout={onLogout} />}
      </div>
    </header>
  );
};

export default ElectronTopbar;
