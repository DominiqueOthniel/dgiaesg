# Backend integration guide — /actualites (News)

> this file is the contract the API must
> respect so the existing UI lights up automatically. Implement on your side.

## 1. News model — add 3 fields

```js
// models/News.js
const NewsSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  sector: { type: String, required: true },
  imageUrl: { type: String },
  publishedAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },

  // NEW — editorial format (rubrique principale)
  format: {
    type: String,
    enum: ["breve", "analyse", "enquete", "interview", "communique"],
    required: true,
    index: true,
  },

  // NEW — thematic sub-category. Free string but stay aligned with the
  // slugs the frontend chip bar uses (see THEMES table below) so the
  // labels stay meaningful.
  category: {
    type: String,
    required: true,
    index: true,
  },

  // NEW — reading time in minutes (used for "Flash 2 min" / "Lecture 12 min")
  readingTime: { type: Number, default: 1 },
});
```

### Allowed values

| `format`     | URL slug (FR) | Frontend label |
| ------------ | ------------- | -------------- |
| `breve`      | `breves`      | Brèves         |
| `analyse`    | `analyses`    | Analyses       |
| `enquete`    | `enquetes`    | Enquêtes       |
| `interview`  | `interviews`  | Interviews     |
| `communique` | `communiques` | Communiqués    |

| `category` slug    | Frontend chip   |
| ------------------ | --------------- |
| `finance-durable`  | Finance         |
| `mines-energie`    | Énergie         |
| `climat`           | Climat          |
| `social`           | Social          |
| `infrastructure`   | Infrastructure  |
| `agro-industrie`   | Agro            |

> Add new themes any time — the frontend `THEMES` array in
> `src/pages/NewsPage.tsx` is the single source of truth for the chip bar.
> Just keep slugs URL-safe (lowercase, kebab-case, no accents).

## 2. Controller — accept the new query params

```js
// controllers/newsController.js
exports.getNews = async (req, res) => {
  const { format, category, sector, search, from, to, sort } = req.query;
  const q = {};

  if (format)   q.format = format;     // exact match against enum value
  if (category) q.category = category; // exact match
  if (sector)   q.sector = sector;
  if (search)   q.$text = { $search: search }; // or regex on title/excerpt
  if (from || to) {
    q.publishedAt = {};
    if (from) q.publishedAt.$gte = new Date(from);
    if (to)   q.publishedAt.$lte = new Date(to);
  }

  const sortMap = {
    newest: { publishedAt: -1 },
    popular: { views: -1 },
    title: { title: 1 }
  };

  const items = await News.find(q).sort(sortMap[sort] || { publishedAt: -1 });
  res.json(items);
};
```

Recommended index for the most common query:

```js
NewsSchema.index({ format: 1, category: 1, publishedAt: -1 });
```

## 3. Frontend → Backend coupling map

| Frontend state                         | Sent as          | Notes                                                             |
| -------------------------------------- | ---------------- | ----------------------------------------------------------------- |
| Format pill bar / `/actualites/$format` | `?format=…`     | Use the **enum value** (singular), not the URL slug.              |
| Theme chip bar                          | `?category=…`    | Use the slug from the table above.                                |
| Search input                            | `?search=…`      |                                                                   |
| Period popover                          | `?from=…&to=…`   | ISO-8601 dates.                                                   |
| Sector dropdown (existing)              | `?sector=…`      | Already wired.                                                    |
| Sort dropdown                           | `?sort=…`        | Values: `newest`, `popular`, `title`.                             |

## 4. Where to plug the API in the frontend

In `src/pages/NewsPage.tsx`, replace the `MOCK_NEWS` constant with a fetch
(or React Query call) that hits the API with the params above. Every other
piece of UI — badges, reading-time labels, pill bar, chip bar, dynamic route
`/actualites/analyses` etc. — already reads from the `format`, `category`
and `readingTime` fields, so no further frontend change is required once
the API returns articles in that shape.

## 5. Routes already shipped (frontend)

| URL                          | Behavior                                |
| ---------------------------- | --------------------------------------- |
| `/actualites`                | All articles, no format filter          |
| `/actualites/breves`         | `format=breve` pre-selected             |
| `/actualites/analyses`       | `format=analyse` pre-selected           |
| `/actualites/enquetes`       | `format=enquete` pre-selected           |
| `/actualites/interviews`     | `format=interview` pre-selected         |
| `/actualites/communiques`    | `format=communique` pre-selected        |
| `/news`                      | Legacy alias kept for compatibility     |

Each `/actualites/*` route ships its own `head()` (title, description,
og:title, og:description) for SEO and social sharing.

---

# Thematic Pillars Portal — `/thematiques`

A second editorial axis in addition to `format`. Six "pillar" hubs aggregate
all articles tagged with a given theme. Frontend is **already wired** — the
backend just needs to expose the right fields and accept the right query
params.

## 6. Use the `category` field for pillar slugs

The `category` field on the `News` model must equal one of the six pillar
slugs below. The frontend uses this exact string to fetch each hub's feed.

| Pillar              | `category` slug        | Color (UI accent) |
| ------------------- | ---------------------- | ----------------- |
| Climat & Énergie    | `climat-energie`       | emerald           |
| Finance ESG         | `finance-esg`          | sky               |
| RSE Entreprises     | `rse-entreprises`      | indigo            |
| Gouvernance         | `gouvernance`          | slate             |
| Social & Inclusion  | `social-inclusion`     | rose              |
| Agri & Biodiversité | `agri-biodiversite`    | amber             |

> The previous "theme chip bar" slugs on `/actualites` (`finance-durable`,
> `mines-energie`, `climat`, `social`, `infrastructure`, `agro-industrie`)
> can either be **migrated** to the pillar slugs above (recommended) or kept
> as a parallel `tags: string[]` field. The cleanest model is: **one
> `category` per article = one pillar**, plus optional finer-grained
> `subCategory` (see below).

## 7. Add a `subCategory` field (optional but recommended)

Each pillar has its own filter chips on its hub page. Frontend reads them
from `src/lib/pillars.ts`. To make those chips functional, add:

```js
subCategory: { type: String, index: true },
```

Indicative `subCategory` values per pillar (frontend already lists them):

- **climat-energie** — `renouvelables`, `adaptation`, `cop`, `finance-verte`,
  `efficacite`, `hydrogene`
- **finance-esg** — `green-bonds`, `taxonomie`, `isr`, `tcfd`, `microfinance`,
  `impact`
- **rse-entreprises** — `strategies`, `rapports`, `certifications`,
  `supply-chain`, `innovation`
- **gouvernance** — `politiques`, `regulations`, `anti-corruption`,
  `transparence`, `ua-cedeao`
- **social-inclusion** — `genre`, `jeunesse`, `droits`, `travail-decent`,
  `education`, `sante`
- **agri-biodiversite** — `agri-durable`, `forets`, `oceans`, `biodiversite`,
  `supply-chain`, `agroecologie`

## 8. API endpoint expectation

```
GET /api/news?category=<pillarSlug>&subCategory=<subSlug>
```

Both params are optional. When `subCategory` is omitted, return every article
of the pillar. Pagination/sort are the same as on `/actualites`.

## 9. Routes already shipped (frontend) — pillars

| URL                                  | Behavior                              |
| ------------------------------------ | ------------------------------------- |
| `/thematiques`                       | Portal: grid of the 6 pillar cards    |
| `/thematiques/climat-energie`        | Hub: `category=climat-energie`        |
| `/thematiques/finance-esg`           | Hub: `category=finance-esg`           |
| `/thematiques/rse-entreprises`       | Hub: `category=rse-entreprises`       |
| `/thematiques/gouvernance`           | Hub: `category=gouvernance`           |
| `/thematiques/social-inclusion`      | Hub: `category=social-inclusion`      |
| `/thematiques/agri-biodiversite`     | Hub: `category=agri-biodiversite`     |

Each route ships its own SEO `head()` (H1, meta description, og:title,
og:description) using the supervisor-defined copy.

## 10. Single source of truth on the frontend

All pillar metadata (slug, H1, description, color, icon, sub-categories)
lives in **`src/lib/pillars.ts`**. If the editorial team renames a pillar or
adds a new sub-category, that one file is the only thing to touch.
