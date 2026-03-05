/**
 * ElectronLayout - Main layout wrapper for Electron app
 *
 * Combines sidebar and topbar navigation for desktop experience.
 * Wraps page content with the desktop navigation chrome.
 */

import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import ElectronSidebar from "./ElectronSidebar";
import ElectronTopbar from "./ElectronTopbar";
import { useAuth } from "@/hooks/useAuth";

interface ElectronLayoutProps {
  children: ReactNode;
}

const ElectronLayout = ({ children }: ElectronLayoutProps) => {
  const navigate = useNavigate();
  const { logout, isLoggedIn } = useAuth();

  const handleLogout = () => {
    logout();
    // Redirect to home/welcome screen after logout
    navigate("/");
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar - always visible when logged in */}
      {isLoggedIn && <ElectronSidebar />}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar - always visible when logged in */}
        {isLoggedIn && <ElectronTopbar onLogout={handleLogout} />}

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ElectronLayout;
