# Guide Exhaustif de Présentation - CoopLabel

Ce guide structuré est votre support principal pour la démonstration client. Il détaille chaque fonctionnalité, son fonctionnement utilisateur, et sa correspondance technique dans le code (Mapping CRUD).

---

## 👤 SECTION 1 : EXPÉRIENCE UTILISATEUR (User Side)

### 📋 Liste des Fonctionnalités
- **Navigation Libre (Guest Mode)** : Consultation illimitée des labels, de l'annuaire, du journal et des médias sans compte.
- **Feedback Interactif** : Notifications instantanées (Toasts) guidant l'utilisateur vers la connexion pour les actions restreintes.
- **Authentification Hybride** : Connexion via Email ou Nom d'utilisateur avec sécurité renforcée.
- **Bibliothèque Personnelle (Library)** : Système de sauvegarde double (Articles & Protocoles) avec gestion en temps réel.
- **Indexation & Recherche** : Moteur de recherche performant et filtres multicritères (Secteur, Région, Standard).
- **Profil Utilisateur** : Gestion des informations personnelles et historique de l'activité.
- **Monétisation (Premium)** : Accès restreint au contenu "PRO" avec tunnel de vente (Pricing) et gating visuel.
- **Régie Publicitaire** : Affichage dynamique de bannières partenaires ciblées par position (Sidebar, Top, Inline).
- **Kiosque Digital** : Consultation et téléchargement (PRO uniquement) de revues mensuelles en PDF.
- **FA TV & Podcasts** : Accès libre aux contenus vidéo (YouTube) et audio (Spotify) embarqués.
- **Filtrage Avancé** : Filtres par secteur, zone géographique, standard et type de contenu sur toutes les pages principales.
- **Navigation Intelligente** : Bouton "Retour" contextuel et scroll automatique en haut de page lors de la navigation/pagination.

---

### 🔍 Détails des Fonctions User & Code Mapping

#### 1. Consultation des Protocoles (Labels)
- **Fonctionnement** : L'utilisateur navigue dans l'index des labels. Chaque page affiche des scores de maturité, des workflows de validation et des pondérations de critères en temps réel.
- **Code Frontend** : `frontend/src/pages/LabelsPage.tsx` (Index) & `frontend/src/pages/LabelDetailPage.tsx` (Détails).
- **Code Backend (CRUD - Read)** : `backend/src/controllers/label.controller.ts` -> `getLabels`, `getLabelBySlug`.
- **Modèle Data** : `backend/src/models/Label.ts`.

#### 2. Système de Sauvegarde (Save to Library)
- **Fonctionnement** : Un clic sur l'icône "Signet" (Bookmark) ajoute ou retire l'élément de la bibliothèque. Si non connecté, un toast instantané est déclenché.
- **Logique de Toggle** : Gérée par une simple pression sur le bouton qui appelle l'API de basculement (Sync efficace).
- **Code Backend (CRUD - Update)** : `backend/src/controllers/user.controller.ts` -> `toggleSaveArticle` & `toggleSaveLabel`.
- **Code Frontend UI** : `handleToggleSave` dans `LabelDetailPage.tsx` et `NewsArticlePage.tsx`.

#### 3. Ma Bibliothèque (Portal)
- **Fonctionnement** : Un espace centralisé avec deux onglets distincts pour retrouver ses articles favoris et ses protocoles suivis.
- **Code Frontend** : `frontend/src/pages/SavedArticles.tsx` (Gère l'affichage switchable via State).
- **Service API** : `backend/src/routes/user.routes.ts` -> GET `/saved-items`.

#### 4. Gating Premium & Pricing
- **Fonctionnement** : Les articles « Premium » sont accessibles en aperçu (3 premiers paragraphes + flou progressif). Un CTA dirige l'utilisateur vers la page de tarification. Les utilisateurs PRO voient le contenu complet et peuvent télécharger les PDF du Kiosque.
- **Code Frontend** : `frontend/src/pages/PricingPage.tsx` (Plans tarifaires en FCFA), `frontend/src/pages/NewsArticlePage.tsx` (Gating visuel), `frontend/src/pages/KioskPage.tsx` (Restriction PDF).
- **Code Backend** : Champ `isPro`, `subscriptionPlan`, `subscriptionExpiry` sur le modèle `User`.

#### 5. Régie Publicitaire (Ad System)
- **Fonctionnement** : Affichage dynamique de bannières partenaires (Sidebar, Top, Inline). Suivi automatique des impressions et des clics. L'administrateur gère les campagnes via le dashboard.
- **Code Frontend** : `frontend/src/components/AdBanner.tsx` (Composant d'affichage), intégré dans les pages News et Article.
- **Code Backend (CRUD)** :
  - **Read (Public)** : `GET /api/ads/random?position=sidebar` — Récupère une publicité aléatoire active.
  - **Track Click** : `POST /api/ads/:id/click` — Enregistre un clic.
  - **List (Admin)** : `GET /api/ads` — Liste toutes les campagnes.
  - **Create (Admin)** : `POST /api/ads` — Crée une campagne (title, imageUrl, targetUrl, position, startDate, endDate).
  - **Update (Admin)** : `PUT /api/ads/:id` — Modifie une campagne.
  - **Delete (Admin)** : `DELETE /api/ads/:id` — Supprime une campagne.
- **Modèle Data** : `backend/src/models/Ad.ts`.

---

## 🛠️ SECTION 2 : DASHBOARD D'ADMINISTRATION (Admin Side)

### 📋 Liste des Fonctionnalités
- **Gestionnaire de Protocoles** : Création, modification et archivage des standards de certification.
- **Base de Données Entreprises** : Administration complète de l'annuaire des entités certifiées (scores, secteurs, régions).
- **Rédaction Éditoriale** : Système de publication d'articles de presse et de "Revues Mensuelles" (PDF).
- **Multimedia Control** : Gestion des flux TV (YouTube) et Podcasts (Spotify) avec upload d'image de couverture.
- **Alertes Flash** : Contrôle du bandeau de news défilantes (Breaking News) en temps réel.
- **Standardisation des Critères** : Configuration précise des matrices d'évaluation pour chaque label.
- **Régie Publicitaire** : Création, suivi et gestion des campagnes publicitaires avec métriques (impressions/clics).
- **Gestion des Abonnements** : Administration des comptes utilisateurs et de leur statut PRO/Free.
- **Auto-Refresh** : Toutes les opérations CRUD (ajout, modification, suppression) se reflètent instantanément dans l'interface sans rechargement manuel.
- **Actions Visibles** : Boutons « Modifier » et « Archiver/Supprimer » toujours visibles avec libellés clairs sur toutes les pages admin.

---

### 🔧 Détails des Fonctions Admin & Code Mapping

#### 1. CRUD Protocoles & Standards (Labels)
- **Fonctionnement** : L'admin définit le nom, le logo, le secteur et la description. Possibilité d'archiver (Soft Delete) au lieu de supprimer.
- **Code Interface** : `frontend/src/pages/admin/LabelsAdmin.tsx`.
- **Code Backend** : `backend/src/controllers/label.controller.ts` -> `createLabel`, `updateLabel`, `deleteLabel`.
- **Routes API** : `POST /api/labels`, `PUT /api/labels/:id`, `DELETE /api/labels/:id`, `PUT /api/labels/:id/restore`.

#### 2. Pilotage de l'Annuaire (Companies)
- **Fonctionnement** : Liaison des entreprises aux labels, mise à jour des scores d'impact (Social & Gouvernance) et des secteurs géographiques. Les scores persistent correctement grâce au système de réinitialisation de formulaire.
- **Code Interface** : `frontend/src/pages/admin/CompaniesAdmin.tsx` & `frontend/src/components/CompanyForm.tsx`.
- **Code Backend** : `backend/src/controllers/company.controller.ts` -> `createCompany`, `updateCompany`, `deleteCompany`.
- **Routes API** : `POST /api/companies`, `PUT /api/companies/:id`, `DELETE /api/companies/:id`, `PUT /api/companies/:id/restore`.

#### 3. Centre Éditorial & Kiosque (News & Reviews)
- **Fonctionnement** : Publication d'actualités avec gestion des catégories et des mises en avant. Gestion du Kiosque Digital pour les fichiers PDF (upload couverture + PDF).
- **Code Interface** : `frontend/src/pages/admin/NewsAdmin.tsx` & `frontend/src/pages/admin/ReviewAdmin.tsx`.
- **Code Backend** : `backend/src/controllers/news.controller.ts` & `backend/src/controllers/monthlyReview.controller.ts`.
- **Routes API** :
  - News : `POST /api/news`, `PUT /api/news/:id`, `DELETE /api/news/:id`, `PUT /api/news/:id/restore`.
  - Reviews : `POST /api/reviews`, `DELETE /api/reviews/:id`.

#### 4. Régie Multimedia (Videos & Podcasts)
- **Fonctionnement** : Ajout simplifié d'URL d'intégration (Embed) avec upload d'image de couverture et rendu automatique sur la plateforme.
- **Code Interface** : `frontend/src/pages/admin/MultimediaAdmin.tsx`.
- **Code Backend** : `backend/src/controllers/multimedia.controller.ts`.
- **Routes API** : `POST /api/multimedia`, `PATCH /api/multimedia/:id`, `DELETE /api/multimedia/:id`.

#### 5. Flash Info / Breaking News
- **Fonctionnement** : Création et gestion des messages urgents affichés dans le bandeau défilant. Chaque message dispose d'une priorité, d'un statut actif/inactif et d'une date d'expiration.
- **Code Interface** : `frontend/src/pages/admin/BreakingNewsAdmin.tsx`.
- **Code Backend** : `backend/src/controllers/breakingNews.controller.ts`.
- **Routes API** : `POST /api/breaking-news`, `PUT /api/breaking-news/:id`, `DELETE /api/breaking-news/:id`.

#### 6. Pilotage Monétisation (Ads & Abonnements)
- **Fonctionnement** : Gestion complète des campagnes publicitaires avec suivi des impressions et clics. Administration des comptes utilisateurs pour activer/désactiver le statut PRO et gérer les plans d'abonnement.
- **Code Interface** : `frontend/src/pages/admin/AdAdmin.tsx` & `frontend/src/pages/admin/SubscriptionAdmin.tsx`.
- **Code Backend** :
  - Ads : `backend/src/controllers/ad.controller.ts` -> `getAds`, `createAd`, `updateAd`, `deleteAd`.
  - Users : `backend/src/controllers/user.controller.ts` -> `getUsers`, `updateUserSubscription`.
- **Routes API** :
  - Ads : `GET /api/ads`, `POST /api/ads`, `PUT /api/ads/:id`, `DELETE /api/ads/:id`.
  - Users Admin : `GET /api/users` (liste), `PUT /api/users/:id/subscription` (mise à jour abonnement).
- **Swagger** : Documentation complète Swagger accessible à `/api-docs` pour toutes les routes Ads et Users.

#### 7. Gestion des Critères d'Évaluation
- **Fonctionnement** : Configuration des critères ESG (Environnemental, Social, Gouvernance) avec pondérations par catégorie. Association des critères aux labels pour le calcul des scores.
- **Code Interface** : `frontend/src/pages/admin/CriteriaAdmin.tsx`.
- **Code Backend** : `backend/src/controllers/criteria.controller.ts` & `backend/src/controllers/companyCriteria.controller.ts`.
- **Routes API** : `POST /api/criteria`, `PUT /api/criteria/:id`, `DELETE /api/criteria/:id`.

---

## 🔑 POINTS TECHNIQUES CLÉS (Selling Points)
1. **Architecture Isomorphe** : Séparation stricte entre le Frontend (React/Vite) et le Backend (Node/Express/MongoDB) pour une scalabilité maximale.
2. **Performance (Caching)** : Utilisation massive de **React Query** pour éviter les chargements inutiles et assurer une fluidité "App Native". Auto-invalidation du cache après chaque opération CRUD.
3. **Sécurité Militaire** : Middleware de protection des routes (`ProtectedRoute.tsx`), hashage BCrypt et tokens JWT à expiration contrôlée. Restriction d'accès PDF aux utilisateurs PRO.
4. **UX Responsive** : Design entièrement adaptatif avec micro-interactions fluides développées en Framer Motion.
5. **Documentation API** : Swagger UI accessible à `/api-docs` avec documentation complète de toutes les routes (Auth, Users, Labels, Companies, News, Reviews, Multimedia, Breaking News, Ads).
6. **Upload Fichiers** : Système d'upload intégré pour images et PDFs via le composant `FileUpload`, remplaçant les URL manuelles.
7. **Monétisation Multi-niveaux** : Système d'abonnement FCFA (Starter, Professional, Enterprise) avec gating visuel progressif et badges Premium.
8. **Seeding Complet** : Script de seeding automatique (`seed-everything.ts`) peuplant toutes les sections avec 13 entrées (10 standard + 3 premium) incluant images et contenus riches.
