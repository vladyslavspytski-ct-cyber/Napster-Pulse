import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { isElectron } from "@/lib/electron";
import { useToast } from "@/hooks/use-toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import InterviewArchitectTest from "./pages/InterviewArchitectTest";
import PublicInterview from "./pages/PublicInterview";
import Dashboard from "./pages/Dashboard";
import SavedInterviews from "./pages/SavedInterviews";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import MyPlan from "./pages/MyPlan";
import PricingV2 from "./pages/PricingV2";
import PricingV3 from "./pages/PricingV3";
import MyPlanV2 from "./pages/MyPlanV2";
import MyPlanV3 from "./pages/MyPlanV3";
import TemplateDirectory from "./pages/TemplateDirectory";
import CreateInterviewFromTemplate from "./pages/CreateInterviewFromTemplate";
import InterviewAnalysis from "./pages/InterviewAnalysis";
import InterviewAnalysisV2 from "./pages/InterviewAnalysisV2";
import InterviewAnalysisExp from "./pages/InterviewAnalysisExp";
import InsightDemo from "./pages/InsightDemo";
import ElectronAuth from "./pages/ElectronAuth";
import MyAccount from "./pages/MyAccount";

const queryClient = new QueryClient();

// Use HashRouter for Electron (file:// protocol doesn't work with BrowserRouter)
// Use BrowserRouter for web
const Router = isElectron() ? HashRouter : BrowserRouter;

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
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
    storageKey="theme"
  >
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SessionExpiredListener />
          <Router>
            <Routes>
            <Route path="/" element={<Index />} />
            {/* /create-interview now uses InterviewArchitectTest (CreateInterview temporarily hidden) */}
            <Route path="/create-interview" element={<InterviewArchitectTest />} />
            {/* Keep old path for backwards compatibility */}
            <Route path="/interview-architect-test" element={<InterviewArchitectTest />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/saved-interviews" element={<SavedInterviews />} />
            <Route path="/i/:token" element={<PublicInterview />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/pricing-v2" element={<PricingV2 />} />
            <Route path="/pricing-v3" element={<PricingV3 />} />
            <Route path="/my-plan" element={<MyPlan />} />
            <Route path="/account" element={<MyAccount />} />
            <Route path="/my-plan-v2" element={<MyPlanV2 />} />
            <Route path="/my-plan-v3" element={<MyPlanV3 />} />
            <Route path="/templates" element={<TemplateDirectory />} />
            <Route path="/templates/:categoryId" element={<TemplateDirectory />} />
            <Route path="/templates/:categoryId/:typeId" element={<TemplateDirectory />} />
            <Route path="/create-interview-from-template" element={<CreateInterviewFromTemplate />} />
            <Route path="/dashboard/interview/:interviewId" element={<InterviewAnalysis />} />
            <Route path="/dashboard/interview/:interviewId/test" element={<InterviewAnalysisV2 />} />
            <Route path="/dashboard/interview/:interviewId/test-2" element={<InterviewAnalysisExp />} />
            <Route path="/dashboard/insight-demo" element={<InsightDemo />} />
            {/* Electron-specific routes */}
            <Route path="/electron-auth" element={<ElectronAuth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
