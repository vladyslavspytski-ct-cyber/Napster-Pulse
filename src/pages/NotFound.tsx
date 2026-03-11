import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ElectronPageWrapper from "@/components/electron/ElectronPageWrapper";
import { useIsElectron } from "@/lib/electron";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useIsElectron();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate(isDesktop ? "/dashboard" : "/");
  };

  return (
    <ElectronPageWrapper>
    <div className={`flex min-h-screen items-center justify-center bg-muted ${isDesktop ? 'electron-page' : ''}`}>
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <button
          onClick={handleGoHome}
          className="text-primary underline hover:text-primary/90"
        >
          Return to {isDesktop ? "Dashboard" : "Home"}
        </button>
      </div>
    </div>
    </ElectronPageWrapper>
  );
};

export default NotFound;
