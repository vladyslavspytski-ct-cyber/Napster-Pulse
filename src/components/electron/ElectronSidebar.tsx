/**
 * ElectronSidebar - Desktop navigation sidebar for Electron app
 *
 * Provides a compact, icon-based sidebar with tooltips.
 * Designed for desktop use with keyboard navigation support.
 */

import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Plus,
  Settings,
  Mic,
  User,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { isMacOS } from "@/lib/electron";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: "Results",
    href: "/dashboard",
    requiresAuth: true,
  },
  {
    icon: FolderOpen,
    label: "Library",
    href: "/library",
    requiresAuth: true,
  },
  {
    icon: FileText,
    label: "Templates",
    href: "/templates",
    requiresAuth: true,
  },
];

const ElectronSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname.startsWith("/dashboard");
    }
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  const handleNavClick = (item: NavItem) => {
    if (item.requiresAuth && !isLoggedIn) {
      // Redirect to auth if not logged in
      navigate("/electron-auth", { state: { redirectTo: item.href } });
      return;
    }
    navigate(item.href);
  };

  const handleCreateClick = () => {
    if (!isLoggedIn) {
      navigate("/electron-auth", { state: { redirectTo: "/create-interview" } });
      return;
    }
    navigate("/create-interview");
  };

  // On macOS, leave space for window controls (traffic lights)
  const isMac = isMacOS();

  return (
    <aside className="w-16 h-full bg-sidebar-background border-r border-sidebar-border flex flex-col">
      {/* Logo - with extra top padding on macOS for traffic lights */}
      <div
        className={cn(
          "flex items-center justify-center border-b border-sidebar-border",
          isMac ? "h-20 pt-6" : "h-14"
        )}
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center transition-transform hover:scale-105">
            <Mic className="w-5 h-5 text-primary-foreground" />
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 flex flex-col items-center gap-2">
        {/* Create new button */}
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              onClick={handleCreateClick}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "shadow-sm hover:shadow-md"
              )}
            >
              <Plus className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            <p>New Interview</p>
          </TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="w-8 h-px bg-sidebar-border my-2" />

        {/* Main nav items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Tooltip key={item.href} delayDuration={100}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleNavClick(item)}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {/* Bottom section - Account & Settings */}
      <div className="py-4 flex flex-col items-center gap-2 border-t border-sidebar-border">
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              onClick={() => navigate("/account")}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                location.pathname === "/account"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <User className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            <p>My Account</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              onClick={() => navigate("/my-plan")}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                location.pathname === "/my-plan"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Settings className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
};

export default ElectronSidebar;
