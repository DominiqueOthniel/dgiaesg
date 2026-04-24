# Coop Label — Home Page Improvements

This zip contains the changes requested by your supervisor for the
**home page** of `NkwesiDitrich/coop-label`. The folder structure inside
the archive **mirrors the GitHub repo paths exactly**, so you can drop
the files straight into your local clone.

```
coop-changes/
└── frontend/
    └── src/
        ├── components/
        │   └── home/
        │       └── SynergiesSection.tsx   ← REPLACE
        └── styles.css.snippet              ← MERGE (do NOT replace)
```

---

## 1. What changed and why

| # | Supervisor request | Where it was fixed |
|---|---|---|
| 1 | Center the **"Synergies & Événements"** section in the middle of the page | `SynergiesSection.tsx` — `ViewportSection` now uses `items-center justify-center` + `w-full` and larger responsive vertical padding (`py-12 sm:py-16 md:py-20 lg:py-24`). |
| 2 | Improve contrast in **"Restez informé / Restons connectés"** — bottom text in white | `SynergiesSection.tsx` — newsletter card title, description and input placeholder switched to `text-white` / `text-white/90` / `placeholder:text-white/50`. The events column header and "Voir tout" link were also re-colored to white/gold (they were dark and unreadable on the dark gradient). |
| 3 | Better responsive display — the app must take the full viewport | `styles.css.snippet` — adds `width: 100%`, removes default margins on `html`/`body`, and `overflow-x: hidden` so nothing pushes the page wider than the screen. The section grid was also tuned to scale gaps between mobile and desktop. |

> **Backend logic is preserved.** The component still receives
> `events` and `eventsLoading` as props from the parent (`Home.tsx` /
> the `useEvents` hook) and the newsletter form still POSTs to
> `/newsletter/subscribe` via `@/services/api`. No data fetching code
> was touched.

---

## 2. Integration steps (≈ 2 minutes)

From the **root of your local `coop-label` clone**:

### Step 1 — Replace `SynergiesSection.tsx`

```bash
cp coop-changes/frontend/src/components/home/SynergiesSection.tsx \
   frontend/src/components/home/SynergiesSection.tsx
```

This file uses your real imports (`react-router-dom`, `react-i18next`,
`@/services/api`) — **not** the static-preview shims — so it should
compile without any other change.

### Step 2 — Merge the CSS snippet into `frontend/src/styles.css`

Open `coop-changes/frontend/src/styles.css.snippet` and copy the rules
inside the existing `@layer base { ... }` block of
`frontend/src/styles.css`. The final block should look like:

```css
@layer base {
  * {
    border-color: var(--color-border);
  }

  html,
  body {
    width: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    overflow-x: hidden;
  }
}
```

> ⚠️ **Do not overwrite** the entire `styles.css` — your file contains
> all the brand tokens (`--brand-gold`, `--brand-deep`, `--brand-emerald`,
> etc.). Just add the `html, body { … }` rule and the `overflow-x: hidden`
> line.

### Step 3 — Verify

```bash
cd frontend
npm install   # only if needed
npm run dev
```

Open the home page and check:

- The **Synergies & Événements** section sits centered with generous
  top/bottom space at every breakpoint.
- The **Newsletter** title, description and email placeholder are
  clearly readable in white over the dark green/gold gradient.
- Resizing the browser from mobile (375 px) up to ultra-wide
  (1920 px+) keeps the layout filling the full viewport with no
  horizontal scroll.

---

## 3. Files in this zip

| File | Action |
|------|--------|
| `frontend/src/components/home/SynergiesSection.tsx` | **Replace** the existing file. |
| `frontend/src/styles.css.snippet` | **Merge** into your existing `frontend/src/styles.css` (instructions above). |
| `INTEGRATION_GUIDE.md` | This document. |

---

## 4. Rollback

If anything goes wrong:

```bash
git checkout -- frontend/src/components/home/SynergiesSection.tsx \
                frontend/src/styles.css
```

That's it — only two files are touched.
