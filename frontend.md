## Frontend Redesign Roadmap (Financial Afrik Style)

This document describes how to evolve the existing frontend into a news‑grade editorial experience inspired by `financialafrik.com`, while preserving and highlighting CoopLabel’s certification features.

The phases are ordered; you can ship each one independently.

---

## Phase 1 – Global Shell & Design System (FOUNDATION)

- **Goal**: Make every page feel like the same professional editorial product.

- **Tasks**
  - **Navbar & Header**
    - Refine `Layout` header to fully match the Financial Afrik pattern:
      - Top offset header that snaps to the top on scroll (already mostly done via `isScrolled`).
      - Clear hierarchy: logo (left), main categories (center), user/auth + search (right).
      - Ensure dropdown behavior on `Secteurs` is smooth (hover on desktop, tap‑to‑toggle on mobile).
    - Add/verify high‑level nav items: `Journal`, `Secteurs`, `Labels`, `Annuaire`, `Médiatique`, `Kiosque`, `Évènements`, `Premium`.
  - **Footer**
    - Create a consistent footer with:
      - About, Methodology, Certification Charter, Contact, Privacy/Cookies links.
      - Newsletter mention, social links.
      - Copyright and legal text.
  - **Design Tokens & Utilities**
    - Leverage existing `index.css` editorial theme:
      - Confirm color usage for headings, links, metadata, and backgrounds across pages.
      - Standardize typography scale (H1–H4, body, metadata).
    - Ensure shared layout helpers exist (`editorial-container`, `.metadata`, `.btn-paper`, etc.) and are used consistently.

- **Acceptance criteria**
  - All public pages use the same header and footer.
  - Navigation labels and ordering are consistent with the target UX.
  - On scroll, header becomes compact but remains readable and non‑jumpy.

---

## Phase 2 – Homepage Alignment (A LA UNE)

- **Goal**: Make `/` strongly resemble a professional press front page while surfacing CoopLabel’s value.

- **Tasks**
  - **Hero Press Grid**
    - Keep and refine the asymmetric hero already in `Home.tsx`:
      - 1 major featured article (hero) with category pill, optional `PREMIUM` badge, author, and date.
      - 4–6 secondary articles in a dense grid under/next to the hero (1+4 grid).
    - Ensure this grid uses real News data with correct sectors and subcategories.
  - **Category Sections**
    - Below hero, organize news into editorial blocks:
      - Example blocks: `Finance & Marchés`, `ESG & Climat`, `Leaders & Entretiens`, `Secteurs`.
      - Each block shows 3–6 recent items with metadata and `VOIR TOUT` link to filtered category pages.
  - **Sidebar on Home**
    - Refine the right‑hand column already present:
      - Ensure `AdBanner` positions (sidebar) match business rules.
      - Show “Latest analyses / A la Une” list (compact cards).
      - Keep a strong Newsletter block and ensure copy, CTAs, and routing (`/newsletters`, `/newsletter/:id`) are correct.
  - **In‑Kiosk & Multimedia Strips**
    - Keep the Kiosk & Magazines strip and Multimedia row but align labels to your brand (e.g., “Kiosque Digital CoopLabel”).
    - Make sure magazine cards visually match the editorial look (cover, date, hover overlay).

- **Acceptance criteria**
  - Homepage feels like a newspaper front page: hero + dense article lists + sidebar widgets.
  - All key business verticals (News, Kiosk, Multimedia, Certification/Labels) are discoverable from `/`.

---

## Phase 3 – Article & Category Templates (JOURNAL / SECTEURS)

- **Goal**: Unify all news‑rendering pages behind a consistent editorial template.

- **Tasks**
  - **Generic Two‑Column Template**
    - Create a shared `TwoColumnPage` component that:
      - Renders a page title and optional description.
      - Provides a main content column and a sidebar column consistent with the homepage.
      - Is responsive: 2 columns on desktop, stacked on mobile.
  - **Article List Components**
    - Create reusable `ArticleCard` and `ArticleListSection` components:
      - Support hero vs. list variants (image size, title size).
      - Include category, date, Premium badge, excerpt.
      - Have hover behavior consistent with the homepage.
  - **Apply to Pages**
    - Refactor:
      - `NewsPage.tsx` (global journal).
      - `SectorPage.tsx` (news per sector).
      - Any future category pages (e.g., Leaders, Analysis) to use `TwoColumnPage` + `ArticleListSection`.
    - Sidebar: reuse widgets (Newsletter, Events, Kiosk teaser, Ads).

- **Acceptance criteria**
  - All news listing pages look and behave like variations of the same template.
  - Adding a new category page is mostly wiring data into existing layout components.

---

## Phase 4 – Multimedia & FA TV (MÉDIATIQUE)

- **Goal**: Provide a modern FA TV / podcast hub aligned with the editorial style.

- **Tasks**
  - **Multimedia Hub Layout**
    - Build/refine `MultimediaPage.tsx` as:
      - Header with “FA TV & Podcasts” and description.
      - Featured video/podcast at the top.
      - Grid of recent items below (2–3 columns on desktop).
    - Each card: thumbnail, play icon overlay, title, date, type (TV / Podcast), and sector tag if applicable.
  - **Detail View**
    - Ensure multimedia detail pages (or modals) show:
      - Embedded player (YouTube/Spotify), description, publication date, and related content.
  - **Sidebar & Cross‑Links**
    - Use sidebar to cross‑promote:
      - Latest articles linked to each multimedia piece.
      - Links back to Kiosk, Events, or relevant sectors.

- **Acceptance criteria**
  - `Médiatique` feels like a first‑class media hub, not just a list.
  - Users can easily navigate between multimedia and related articles.

---

## Phase 5 – Kiosk, Premium & Paywall Experience

- **Goal**: Align the monetization UX with a clean editorial paywall similar to Financial Afrik.

- **Tasks**
  - **Kiosk Page**
    - Make `KioskPage.tsx` follow a press kiosk style:
      - Grid of magazine covers (2–4 columns) with issue titles and dates.
      - Hover overlay with “Lire le Journal” or “Télécharger le PDF”.
      - Clearly distinguish PRO‑only editions (badge, lock icon, or tinted overlay).
  - **Premium / Pricing Page**
    - Refine `PricingPage.tsx`:
      - Plans with duration, price, and feature bullets (Free vs PRO).
      - Strong CTAs (“Devenir PRO”, “S’abonner”).
      - Visual emphasis on the main plan.
  - **Article Paywall**
    - In `NewsArticlePage.tsx`:
      - Show partial content for Premium articles (first few paragraphs + blur).
      - Insert a paywall block similar to Financial Afrik:
        - Text explaining which plans unlock the content.
        - Buttons to subscribe or log in.
      - Use your `isPro` and subscription fields to hide/show full content and Kiosk downloads.

- **Acceptance criteria**
  - Premium articles and Kiosk downloads are clearly gated but still tease enough value.
  - The whole PRO experience feels integrated, not bolted‑on.

---

## Phase 6 – Labels, Directory & Org Workflows (PLATFORM SPECIFIC)

- **Goal**: Bring the certification features up to the same visual standard as the media side.

- **Tasks**
  - **Labels Page**
    - Apply editorial layout to `LabelsPage.tsx`:
      - Filters bar (sector, region, status).
      - Grid of label cards inspired by article cards:
        - Name, sector, ESG focus, short description, “Voir le protocole” CTA.
      - Sidebar: explanatory content (“How certification works”), featured labels, links to `Apply`.
  - **Directory / Registry**
    - Align `DirectoryPage.tsx` and `CompanyDetailPage.tsx`:
      - List or table of companies with ESG scores styled like data‑heavy editorial sections.
      - Detail page that reads like a profile article (hero area, sections, key metrics).
  - **Org Hub & Applications**
    - For `OrgProfilePage.tsx`, `ApplyPage.tsx`, `MyApplicationsPage.tsx`, `CertificationHistoryPage.tsx`:
      - Ensure forms and status views reuse typography and spacing from news pages.
      - Add subtle editorial touches: section titles, meta labels, and descriptive copy.

- **Acceptance criteria**
  - Certification and org flows visually match the media UX.
  - Labels and companies feel like part of a “registry of record” rather than a generic CRUD UI.

---

## Phase 7 – Responsive Polish, Micro‑Interactions & QA

- **Goal**: Finish with a smooth, consistent experience on all devices.

- **Tasks**
  - **Responsive checks**
    - For each key page (Home, News, Sector, Article, Multimedia, Kiosk, Labels, Directory, Org Hub):
      - Verify mobile nav behavior, typography sizes, tap targets, and card stacking.
      - Ensure sidebars stack below content and widgets remain readable.
  - **Micro‑interactions**
    - Add/standardize:
      - Hover transitions on cards and buttons (color, subtle scale, shadow).
      - Focus states for accessibility.
      - Smooth scroll for “Back to top” or anchor links where applicable.
  - **Performance sanity**
    - Confirm React Query caching is used efficiently on high‑traffic pages (Home, News, Sector).
    - Avoid layout shifts caused by late‑loading images (reserve aspect ratios).

- **Acceptance criteria**
  - The site feels fluid and intentional on desktop, tablet, and mobile.
  - No major layout bugs remain; user flows are frictionless from discovery → reading → subscription → certification.

