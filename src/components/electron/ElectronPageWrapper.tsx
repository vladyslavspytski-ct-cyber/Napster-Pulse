/**
 * ElectronPageWrapper - Conditional wrapper for Electron pages
 *
 * In web mode: renders children with Header/Footer (as usual)
 * In Electron mode: wraps content in ElectronLayout (sidebar + topbar)
 *
 * This allows gradual migration of pages to Electron layout
 * without breaking web functionality.
 *
 * IMPORTANT: In Electron mode, this wrapper acts as an auth guard.
 * If user is not logged in, they are redirected to the welcome/auth screen.
 */

import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsElectron } from "@/lib/electron";
import { useAuth } from "@/hooks/useAuth";
import ElectronSidebar from "./ElectronSidebar";
import ElectronTopbar from "./ElectronTopbar";

interface ElectronPageWrapperProps {
  children: ReactNode;
  /**
   * If true, Header and Footer from children will be hidden in Electron mode.
   * The wrapper provides its own navigation (sidebar + topbar).
   */
  hideWebNav?: boolean;
  /**
   * If true, require authentication in Electron mode.
   * Unauthenticated users will be redirected to /electron-auth.
   * Defaults to true for protected pages.
   */
  requireAuth?: boolean;
}

const ElectronPageWrapper = ({
  children,
  hideWebNav = true,
  requireAuth = true,
}: ElectronPageWrapperProps) => {
  const isDesktop = useIsElectron();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isLoggedIn } = useAuth();

  // Electron auth guard: redirect to auth page if not logged in
  useEffect(() => {
    if (isDesktop && requireAuth && !isLoggedIn) {
      // Redirect to electron auth with return path
      navigate("/electron-auth", {
        replace: true,
        state: { redirectTo: location.pathname },
      });
    }
  }, [isDesktop, requireAuth, isLoggedIn, navigate, location.pathname]);

  // Web mode: render children as-is (web pages handle their own auth)
  if (!isDesktop) {
    return <>{children}</>;
  }

  // Electron mode: if not logged in and auth required, show nothing while redirecting
  if (requireAuth && !isLoggedIn) {
    return null;
  }

  // Electron mode: wrap in desktop layout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar - always visible when logged in */}
      <ElectronSidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar - always visible when logged in */}
        <ElectronTopbar onLogout={handleLogout} />

        {/* Page content - scrollable */}
        <main className="flex-1 overflow-auto">
          {hideWebNav ? (
            // In Electron mode, we strip Header/Footer from page content
            // by wrapping in a container that adjusts styles
            <div className="electron-page-content">
              {children}
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};

export default ElectronPageWrapper;
