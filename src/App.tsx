import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Index from "./pages/Index";
import CreateInterview from "./pages/CreateInterview";

import InterviewArchitectTest from "./pages/InterviewArchitectTest";
import PublicInterview from "./pages/PublicInterview";
import Dashboard from "./pages/Dashboard";
import SavedInterviews from "./pages/SavedInterviews";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to listen for session expired events and show toast
function SessionExpiredListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleSessionExpired = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string }>;
      toast({
        variant: "destructive",
        title: "Session Expired",
        description: customEvent.detail?.message || "Please log in again.",
      });
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => window.removeEventListener("auth:session-expired", handleSessionExpired);
  }, [toast]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SessionExpiredListener />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create-interview" element={<CreateInterview />} />
            
            <Route path="/interview-architect-test" element={<InterviewArchitectTest />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/saved-interviews" element={<SavedInterviews />} />
            <Route path="/i/:token" element={<PublicInterview />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
