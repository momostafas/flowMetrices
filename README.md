# FlowMetrics demo site

Minimal multi-page **Vue 3 + Vite + Tailwind** marketing site for the fictional B2B product **FlowMetrics**, with **vue-i18n**, **locale-prefixed URLs**, and **RTL** for Arabic.

## Quick start

```bash
cd flowmetrics-demo
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`). You will be redirected to `/en`.

## Locales and URLs

Supported locales: `en` (default), `ar` (RTL), `fr`, `de`.

| Route pattern   | Example        |
|----------------|----------------|
| `/:locale`     | `/en`, `/ar`   |
| `/:locale/features` | `/fr/features` |
| `/:locale/pricing`  | `/de/pricing`    |
| `/:locale/contact`  | `/en/contact`    |

The language switcher in the header updates the **`locale` route param** and keeps the same **route name** (so path shape is preserved).

## Where strings live

All user-visible copy is in **JSON** under `src/locales/`:

- `en.json` — source / default catalog  
- `ar.json`, `fr.json`, `de.json` — translations  

Keys are **nested namespaces**, for example:

| Key | Used for |
|-----|----------|
| `common.nav.*` | Navigation labels |
| `common.footer.*` | Footer |
| `home.hero.*` | Home hero |
| `features.list.*` | Feature grid |
| `pricing.plans.*` | Pricing cards |
| `pricing.faq.*` | FAQ |
| `contact.form.*` | Contact form |

Vue components must use **`useI18n()`** / **`t('namespace.key')`** — do not hardcode UI strings in templates or scripts.

### How keys map to components

1. Pick or add a namespace in the locale JSON (`home`, `pricing`, …).  
2. Reference it with dot paths: `t('pricing.hero.title')`.  
3. For **interpolation**, use named placeholders in JSON (`"from {amount}..."`) and pass an object: `t('pricing.plans.starter.priceNote', { amount: n(29, 'currency') })`.  
4. **Dates** and **numbers**: register formats in `src/i18n/config.ts` (`datetimeFormats`, `numberFormats`), then use **`d()`** and **`n()`** from `useI18n()`.

## Quotai (quotai.net) runtime locales

On **every full page load**, the app calls Quotai’s public API, merges results over the bundled JSON, then starts Vue.

1. Copy `.env.example` to `.env` and set:
   - **`VITE_QUOTAI_BASE_URL`** — API origin without trailing slash (default `https://quotai.net`; local: `http://localhost:5001`).
   - **`VITE_QUOTAI_API_KEY`** — project API key (`qk_...`) from Quotai project settings.
   - **`VITE_QUOTAI_PROJECT_ID`** (recommended) — your project’s id; must match the key’s project or the load fails and cache/static is used.

2. Endpoints used (same as [Quotai API docs](../backend/API_DOCUMENTATION.md)):
   - `GET {base}/api/public/project-info` — optional validation when `VITE_QUOTAI_PROJECT_ID` is set.
   - `GET {base}/api/public/translations` — flat `key → text` per language; keys should use **dot notation** matching vue-i18n paths (e.g. `common.nav.home`).

3. **Caching** — a successful response is stored in **`localStorage`** under `flowmetrics:quotai:v1:{scope}` where `scope` is `VITE_QUOTAI_PROJECT_ID` or a stable hash of the API key. If the network request fails or returns an error, the app **replays the last successful payload** merged over the bundled files. If there is no cache, it falls back to **bundled** `src/locales/*.json` only.

4. **CORS** — the Quotai server must allow your demo origin (e.g. add the site URL to allowed origins / use a dev proxy). The backend already allows `X-API-Key` in CORS headers.

**Security note:** `VITE_*` variables are embedded in the client bundle. For production, prefer a small backend proxy that holds the API key.

## Fallback (missing translation) demo

In **`de.json`**, the key **`pricing.faq.items.sso.answer`** is **omitted** on purpose. With `fallbackLocale: 'en'` in `src/i18n/config.ts`, **vue-i18n** shows the **English** answer while the German question still displays. On the Pricing page, German UI also shows a short **demo hint** banner when the locale is `de`.

## Add a new locale

1. **Copy** `src/locales/en.json` to `src/locales/<code>.json` (e.g. `es.json`).  
2. Translate all values (keep the **same key structure**).  
3. In **`src/i18n/config.ts`**:  
   - import the new JSON in `static-messages.ts`  
   - add it to `staticLocaleMessages`  
   - add entries to `datetimeFormats` and `numberFormats` for that locale code  
4. In **`src/router/index.ts`**: extend the locale param regex, e.g.  
   `path: '/:locale(en|ar|fr|de|es)'`  
5. In **`AppLayout.vue`**: add an `<option>` for the new locale in the `<select>`.  
6. Rebuild and click through every route in the new locale (including **RTL** if applicable).

## Integrating with an external localization API (checklist)

1. **Extract keys** — Export the nested JSON from `en.json` (or flatten keys to `pricing.hero.title` style for your TMS).  
2. **Source language** — Treat `en` as the **default** catalog other languages merge against.  
3. **Push** — Send keys + English values to your API / TMS (include context strings or screenshots if your tool supports them).  
4. **Pull** — Download translated JSON per locale; replace files under `src/locales/` or load at runtime from your CDN.  
5. **Validate** — Run the app per locale; check **RTL**, **date** (`d()`), and **currency** (`n()`) formatting.  
6. **CI** — Add a step that fails if required keys are missing (e.g. compare key paths to `en.json`).  
7. **Deploy** — Ship the updated locale bundles with your static build (`npm run build`).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Preview production build |

## Stack

- Vue 3, Vue Router 4, vue-i18n 9  
- Vite 5, TypeScript, Tailwind CSS 3  
