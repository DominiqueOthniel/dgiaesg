import { Routes, Route, Navigate, Link } from "react-router-dom";
import { lazy, Suspense } from "react";
import SiteLayout from "./components/SiteLayout";
import { ScrollToTop } from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";

import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";

// Public pages with lazy loading
const Home = lazy(() => import("./pages/Home"));
const LabelsPage = lazy(() => import("./pages/LabelsPage"));
const LabelDetailPage = lazy(() => import("./pages/LabelDetailPage"));
const DirectoryPage = lazy(() => import("./pages/DirectoryPage"));
const CompanyDetailPage = lazy(() => import("./pages/CompanyDetailPage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const NewsArticlePage = lazy(() => import("./pages/NewsArticlePage"));
const SectorPage = lazy(() => import("./pages/SectorPage"));
const CountriesPage = lazy(() => import("./pages/CountriesPage"));
const CountryRegionPage = lazy(() => import("./pages/CountryRegionPage"));
const CompaniesPage = lazy(() => import("./pages/CompaniesPage"));
const CompaniesRankingsPage = lazy(() => import("./pages/CompaniesRankingsPage"));
const CompaniesSectorsPage = lazy(() => import("./pages/CompaniesSectorsPage"));
const CompanyProfileSlugPage = lazy(() => import("./pages/CompanyProfileSlugPage"));
const CompaniesProfilesPage = lazy(() => import("./pages/CompaniesProfilesPage"));
const DataPage = lazy(() => import("./pages/DataPage"));
const DataIndicatorsPage = lazy(() => import("./pages/DataIndicatorsPage"));
const DataRankingsPage = lazy(() => import("./pages/DataRankingsPage"));
const DataReportsPage = lazy(() => import("./pages/DataReportsPage"));
const DataComparatorPage = lazy(() => import("./pages/DataComparatorPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const SavedArticles = lazy(() => import("./pages/SavedArticles"));
const KioskPage = lazy(() => import("./pages/KioskPage"));
const MultimediaPage = lazy(() => import("./pages/MultimediaPage"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const RevuePortal = lazy(() => import("./pages/RevuePortal"));
const RevueArchive = lazy(() => import("./pages/RevueArchive"));
const RevueIssuePage = lazy(() => import("./pages/RevueIssuePage"));
const SubscriptionPage = lazy(() => import("./pages/SubscriptionPage"));
const OrgProfilePage = lazy(() => import("./pages/OrgProfilePage"));
const ApplyPage = lazy(() => import("./pages/ApplyPage"));
const MyApplicationsPage = lazy(() => import("./pages/MyApplicationsPage"));
const CertificationHistoryPage = lazy(() => import("./pages/CertificationHistoryPage"));
const ThematiquesPortal = lazy(() => import("./pages/ThematiquesPortal"));
const ThemePillarPage = lazy(() => import("./pages/ThemePillarPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const ContributePage = lazy(() => import("./pages/ContributePage"));

// Admin pages
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const LabelsAdmin = lazy(() => import("./pages/admin/LabelsAdmin"));
const CompaniesAdmin = lazy(() => import("./pages/admin/CompaniesAdmin"));
const CriteriaAdmin = lazy(() => import("./pages/admin/CriteriaAdmin"));
const NewsAdmin = lazy(() => import("./pages/admin/NewsAdmin"));
const BreakingNewsAdmin = lazy(() => import("./pages/admin/BreakingNewsAdmin"));
const ReviewAdmin = lazy(() => import("./pages/admin/ReviewAdmin"));
const MultimediaAdmin = lazy(() => import("./pages/admin/MultimediaAdmin"));
const AdAdmin = lazy(() => import("@/pages/admin/AdAdmin"));
const SubscriptionAdmin = lazy(() => import("@/pages/admin/SubscriptionAdmin"));
const ApplicationsAdmin = lazy(() => import("@/pages/admin/ApplicationsAdmin"));
const ApplicationReviewPage = lazy(() => import("@/pages/admin/ApplicationReviewPage"));
const EventsAdmin = lazy(() => import("./pages/admin/EventsAdmin"));
const NewsletterAdmin = lazy(() => import("./pages/admin/NewsletterAdmin"));

const LoadingPage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-6">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/20" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Initialisation du système...</p>
    </div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingPage />}>
        <Toaster position="top-right" reverseOrder={false} />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="labels" element={<LabelsPage />} />
            <Route path="labels/:id" element={<LabelDetailPage />} />
            <Route path="directory" element={<DirectoryPage />} />
            <Route path="directory/:id" element={<CompanyDetailPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="news/:slug" element={<NewsArticlePage />} />
            <Route path="news/sector/:sector" element={<SectorPage />} />
            <Route path="pays" element={<CountriesPage />} />
            <Route path="pays/:region" element={<CountryRegionPage />} />
            <Route path="entreprises" element={<CompaniesPage />} />
            <Route path="entreprises/classements" element={<CompaniesRankingsPage />} />
            <Route path="entreprises/profils" element={<CompaniesProfilesPage />} />
            <Route path="entreprises/profils/:companySlug" element={<CompanyProfileSlugPage />} />
            <Route path="entreprises/secteurs" element={<CompaniesSectorsPage />} />
            <Route path="donnees" element={<DataPage />} />
            <Route path="donnees/indicateurs" element={<DataIndicatorsPage />} />
            <Route path="donnees/classements" element={<DataRankingsPage />} />
            <Route path="donnees/rapports" element={<DataReportsPage />} />
            <Route path="donnees/comparateur" element={<DataComparatorPage />} />
            <Route path="kiosk" element={<KioskPage />} />
            <Route path="mediatique" element={<MultimediaPage />} />
            <Route path="multimedia" element={<MultimediaPage />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<EventDetail />} />
            <Route path="revue" element={<RevuePortal />} />
            <Route path="revue/numeros" element={<RevueArchive />} />
            <Route path="revue/numeros/:slug" element={<RevueIssuePage />} />
            <Route path="abonnement" element={<SubscriptionPage />} />
            <Route path="a-propos" element={<AboutPage />} />
            <Route path="equipe" element={<TeamPage />} />
            <Route path="contribuer" element={<ContributePage />} />
            
            {/* New Editorial Routes */}
            <Route path="actualites" element={<NewsPage />} />
            <Route path="actualites/:format" element={<NewsPage />} />
            <Route path="thematiques" element={<ThematiquesPortal />} />
            <Route path="thematiques/:pillar" element={<ThemePillarPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="library" element={<SavedArticles />} />
              <Route path="org-hub" element={<OrgProfilePage />} />
              <Route path="org-hub/applications" element={<MyApplicationsPage />} />
              <Route path="org-hub/history" element={<CertificationHistoryPage />} />
              <Route path="apply/:id" element={<ApplyPage />} />
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
              <Route path="ads" element={<AdAdmin />} />
              <Route path="subscriptions" element={<SubscriptionAdmin />} />
              <Route path="applications" element={<ApplicationsAdmin />} />
              <Route path="applications/:id" element={<ApplicationReviewPage />} />
              <Route path="events" element={<EventsAdmin />} />
              <Route path="newsletters" element={<NewsletterAdmin />} />
            </Route>
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* Legacy route redirection */}
          <Route path="/register" element={<Navigate to="/signup" replace />} />
          
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          
          {/* SEO & Compatibility Redirects */}
          <Route path="/journal" element={<Navigate to="/news" replace />} />
          <Route path="/articles" element={<Navigate to="/news" replace />} />
          <Route path="/label" element={<Navigate to="/labels" replace />} />
          <Route path="/annuaire" element={<Navigate to="/directory" replace />} />
          <Route path="/kiosk" element={<Navigate to="/revue/numeros" replace />} />
          <Route path="/pricing" element={<Navigate to="/abonnement" replace />} />
          
          <Route path="*" element={
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
               <h1 className="text-9xl font-black text-muted/10 absolute select-none">404</h1>
               <h2 className="text-2xl font-black text-foreground uppercase italic tracking-tighter mb-4 relative z-10">Matrice non référencée</h2>
               <Link to="/" className="text-xs font-black uppercase tracking-widest text-primary hover:underline relative z-10">Retour à la base</Link>
            </div>
          } />
        </Routes>
    </Suspense>
  );
}

export default App;
