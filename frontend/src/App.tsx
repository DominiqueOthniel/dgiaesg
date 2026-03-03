import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import { Loader2 } from "lucide-react";

// Public pages with lazy loading
const Home = lazy(() => import("./pages/Home"));
const LabelsPage = lazy(() => import("./pages/LabelsPage"));
const LabelDetailPage = lazy(() => import("./pages/LabelDetailPage"));
const DirectoryPage = lazy(() => import("./pages/DirectoryPage"));
const CompanyDetailPage = lazy(() => import("./pages/CompanyDetailPage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const NewsArticlePage = lazy(() => import("./pages/NewsArticlePage"));
const SectorPage = lazy(() => import("./pages/SectorPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SavedArticles = lazy(() => import("./pages/SavedArticles"));
const KioskPage = lazy(() => import("./pages/KioskPage"));

import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";

// Admin pages with lazy loading
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const LabelsAdmin = lazy(() => import("./pages/admin/LabelsAdmin"));
const CompaniesAdmin = lazy(() => import("./pages/admin/CompaniesAdmin"));
const CriteriaAdmin = lazy(() => import("./pages/admin/CriteriaAdmin"));
const NewsAdmin = lazy(() => import("./pages/admin/NewsAdmin"));
const BreakingNewsAdmin = lazy(() => import("./pages/admin/BreakingNewsAdmin"));
const ReviewAdmin = lazy(() => import("./pages/admin/ReviewAdmin"));
const MultimediaAdmin = lazy(() => import("./pages/admin/MultimediaAdmin"));

const LoadingPage = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Initialisation des protocoles...</p>
    </div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="labels" element={<LabelsPage />} />
          <Route path="labels/:id" element={<LabelDetailPage />} />
          <Route path="directory" element={<DirectoryPage />} />
          <Route path="directory/:id" element={<CompanyDetailPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:slug" element={<NewsArticlePage />} />
          <Route path="news/sector/:sector" element={<SectorPage />} />
          <Route path="library" element={<SavedArticles />} />
          <Route path="kiosk" element={<KioskPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="labels" element={<LabelsAdmin />} />
            <Route path="companies" element={<CompaniesAdmin />} />
            <Route path="criteria" element={<CriteriaAdmin />} />
            <Route path="news" element={<NewsAdmin />} />
            <Route path="breaking" element={<BreakingNewsAdmin />} />
            <Route path="reviews" element={<ReviewAdmin />} />
            <Route path="multimedia" element={<MultimediaAdmin />} />
          </Route>
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center font-bold text-slate-300 tracking-tighter uppercase italic">404 — MATRICE NON RÉFÉRENCÉE</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;
