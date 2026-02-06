import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import Index from "./pages/Index";
import Communication from "./pages/Communication";
import TemplatesRegistration from "./pages/TemplatesRegistration";
import TemplatesEmail from "./pages/TemplatesEmail";
import TemplatesSurvey from "./pages/TemplatesSurvey";
import WebsiteBuilder from "./pages/WebsiteBuilder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/events/:eventId/communication" element={<Communication />} />
            <Route path="/templates/registration" element={<TemplatesRegistration />} />
            <Route path="/templates/email" element={<TemplatesEmail />} />
            <Route path="/templates/survey" element={<TemplatesSurvey />} />
            <Route path="/website-builder" element={<WebsiteBuilder />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
