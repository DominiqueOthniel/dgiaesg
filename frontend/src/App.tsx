import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import { Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";

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
const SignupPage = lazy(() => import("./pages/SignupPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const SavedArticles = lazy(() => import("./pages/SavedArticles"));
const KioskPage = lazy(() => import("./pages/KioskPage"));
const MultimediaPage = lazy(() => import("./pages/MultimediaPage"));

import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
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
      <Toaster position="top-right" reverseOrder={false} />
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
          <Route path="kiosk" element={<KioskPage />} />
          <Route path="multimedia" element={<MultimediaPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="library" element={<SavedArticles />} />
          </Route>
        </Route>

        <Route element={<AdminRoute allowedRoles={['admin']} />}>
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
        <Route path="/register" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center font-bold text-slate-300 tracking-tighter uppercase italic">404 — MATRICE NON RÉFÉRENCÉE</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;
