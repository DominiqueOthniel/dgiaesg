# Co-op Label — Frontend Redesign Integration Guide

## 📦 ZIP Contents

### Files Created (NEW)
| File | Purpose |
|------|---------|
| `src/context/AuthContext.tsx` | Authentication context with login/logout, saved articles/labels |
| `src/hooks/useLabel.ts` | Fetch single label by ID |
| `src/hooks/useCompany.ts` | Fetch single company by ID |
| `src/hooks/useNewsArticle.ts` | Fetch single news article by slug |
| `src/hooks/useCriteria.ts` | Fetch label criteria |
| `src/pages/LabelsPage.tsx` | Redesigned labels listing with search & sector filters |
| `src/pages/LabelDetailPage.tsx` | Redesigned label detail with criteria, certified companies |
| `src/pages/DirectoryPage.tsx` | Redesigned directory with grid/list toggle |
| `src/pages/CompanyDetailPage.tsx` | Redesigned company detail with scores |
| `src/pages/NewsPage.tsx` | Redesigned news/journal with featured article layout |
| `src/pages/NewsArticlePage.tsx` | Redesigned article detail with related articles |
| `src/pages/EventsPage.tsx` | Redesigned events listing with type filters |
| `src/pages/EventDetailPage.tsx` | Redesigned event detail |
| `src/pages/MultimediaPage.tsx` | Redesigned multimedia with video/podcast filter |
| `src/pages/KioskPage.tsx` | Redesigned kiosk with magazine grid and downloads |
| `src/pages/LoginPage.tsx` | Professional split-screen login |
| `src/pages/SignupPage.tsx` | Professional split-screen signup |

### Files Modified (REPLACE EXISTING)
| File | Changes |
|------|---------|
| `src/App.tsx` | All routes updated, AuthProvider wrapper added |
| `src/lib/utils.ts` | Added `getLocalized()` helper function |
| `src/index.css` | Brand color tokens (deep green/gold), animations |
| `tailwind.config.ts` | Brand colors, surface tokens, font config |
| `src/components/SiteLayout.tsx` | Professional nav & footer |
| `src/pages/Home.tsx` | Full 9-section redesign |
| `src/i18n.ts` | FR/EN translations |

### Files Unchanged (keep your existing versions)
| File | Note |
|------|------|
| `src/services/api.ts` | Already in ZIP, same as your existing |
| `src/types/index.ts` | Already in ZIP, same as your existing |
| `src/hooks/useLabels.ts` | Already in ZIP, same |
| `src/hooks/useNews.ts` | Already in ZIP, same |
| `src/hooks/useCompanies.ts` | Already in ZIP, same |
| `src/hooks/useEvents.ts` | Already in ZIP, same |
| `src/hooks/useMagazines.ts` | Already in ZIP, same |

## 🔧 Integration Steps

### 1. Extract ZIP into your frontend folder
```bash
cd your-project/frontend
unzip coop-label-redesign.zip -o
```
This will overwrite modified files and add new ones.

### 2. Install additional dependencies (if not already installed)
```bash
npm install framer-motion i18next react-i18next i18next-browser-languagedetector
```

### 3. Verify your `.env` file
```
VITE_API_URL=http://localhost:5000/api
```

### 4. Adapt imports to your project structure
Your original project uses relative imports like `../hooks/useLabels`. The redesign uses `@/` alias imports. If your project doesn't have the `@` alias configured in `vite.config.ts`, either:

**Option A** — Add the alias to your `vite.config.ts`:
```ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
}
```

**Option B** — Find-and-replace `@/` with `../` in all files.

### 5. Handle missing components from your project
The redesign does NOT include these components from your original repo (you keep yours):
- `src/components/AdBanner.tsx` — Ad banners (not used in redesign but can be added)
- `src/components/layout/TwoColumnPage.tsx` — Not needed, redesign uses its own layouts
- `src/components/layout/SidebarStack.tsx` — Not needed
- `src/components/MultimediaSidebar.tsx` — Not needed
- `src/components/articles/ArticleCard.tsx` — Not needed
- `src/components/badges/DigitalBadge.tsx` — Not needed

### 6. Run the project
```bash
npm run dev
```

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | Deep green `160 70% 18%` | Main brand, buttons, headers |
| `--accent` | Gold `45 100% 50%` | CTAs, highlights, badges |
| `--brand-emerald` | `160 84% 39%` | Success states, verified badges |
| `--surface-warm` | `40 30% 98%` | Warm section backgrounds |

## ⚠️ Notes
- All pages fetch real data from your backend API — no invented data
- Empty states display "Aucun..." messages when API is unavailable
- The `AuthContext` uses `localStorage` for token storage (same as original)
- Login/Signup pages call `/auth/login` and `/auth/register` endpoints
