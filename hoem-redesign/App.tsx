import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteLayout from "@/components/SiteLayout";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import "@/i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SiteLayout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/labels" element={<SiteLayout />}>
            <Route index element={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Labels page</div>} />
          </Route>
          <Route path="/labels/:id" element={<SiteLayout />}>
            <Route index element={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Label detail</div>} />
          </Route>
          <Route path="/directory" element={<SiteLayout />}>
            <Route index element={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Directory page</div>} />
          </Route>
          <Route path="/directory/:id" element={<SiteLayout />}>
            <Route index element={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Company detail</div>} />
          </Route>
          <Route path="/news" element={<SiteLayout />}>
            <Route index element={<div className="min-h-screen flex items-center justify-center text-muted-foreground">News page</div>} />
          </Route>
          <Route path="/news/:slug" element={<SiteLayout />}>
            <Route index element={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Article detail</div>} />
          </Route>
          <Route path="/events" element={<SiteLayout />}>
            <Route index element={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Events page</div>} />
          </Route>
          <Route path="/events/:id" element={<SiteLayout />}>
            <Route index element={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Event detail</div>} />
          </Route>
          <Route path="/multimedia" element={<SiteLayout />}>
            <Route index element={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Multimedia page</div>} />
          </Route>
          <Route path="/kiosk" element={<SiteLayout />}>
            <Route index element={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Kiosk page</div>} />
          </Route>
          <Route path="/login" element={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Login page</div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
