import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import SiteLayout from "@/components/SiteLayout";
import Home from "@/pages/Home";
import LabelsPage from "@/pages/LabelsPage";
import LabelDetailPage from "@/pages/LabelDetailPage";
import DirectoryPage from "@/pages/DirectoryPage";
import CompanyDetailPage from "@/pages/CompanyDetailPage";
import NewsPage from "@/pages/NewsPage";
import NewsArticlePage from "@/pages/NewsArticlePage";
import EventsPage from "@/pages/EventsPage";
import EventDetailPage from "@/pages/EventDetailPage";
import MultimediaPage from "@/pages/MultimediaPage";
import KioskPage from "@/pages/KioskPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import NotFound from "@/pages/NotFound";
import "@/i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Pages with SiteLayout (nav + footer) */}
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/labels" element={<LabelsPage />} />
              <Route path="/labels/:id" element={<LabelDetailPage />} />
              <Route path="/directory" element={<DirectoryPage />} />
              <Route path="/directory/:id" element={<CompanyDetailPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:slug" element={<NewsArticlePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/multimedia" element={<MultimediaPage />} />
              <Route path="/kiosk" element={<KioskPage />} />
            </Route>

            {/* Auth pages without SiteLayout */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
