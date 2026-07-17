# 🍽️ Dar Chhiwa — Template Site Restaurant / Snack (Delivery)

Template kaml o jahz bach tbi3ha l ay restaurant wla snack: site web modern b animations, **3 lougha (Français / العربية / English)**, panier, checkout b localisation (carte) + **paiement online b Stripe**, comptes clients, o admin dashboard b l kmal.

## Stack Technique

- **Next.js 15** (App Router, TypeScript) — Frontend + Backend f nafss l projet
- **Tailwind CSS v4** — Styling
- **Framer Motion** — Animations (hero, cards, transitions, cart drawer...)
- **NextAuth v5** — Authentification (Admin + Client), b Credentials (email/password)
- **Système i18n intégré** — FR / AR (RTL) / EN, switcher f navbar, contenu dyal menu multilingue
- **Stripe Checkout** — Paiement b carte bancaire, hosted page sécurisée (PCI-compliant)
- **Leaflet / React-Leaflet** — Carte interactive bach l client ykhtar blasa dyal livraison (bla API key)
- **Recharts** — Charts f admin dashboard
- **Zustand** — State management dyal panier (persisté f localStorage)
- **Base de données** — PostgreSQL via Prisma ORM (schema normalisé, migrations, UUIDs, indexes). Sahla tconnectiha b Vercel Postgres, Neon, Supabase, wla ay host Postgres.
- **SEO** — Sitemap.xml, robots.txt, JSON-LD (Restaurant/Organization/Article schema), Open Graph + Twitter Cards, canonical URLs
- **Sécurité** — Headers (CSP, HSTS, X-Frame-Options...), rate limiting f login/register/orders/checkout
- **Accessibilité (WCAG)** — Skip-to-content, focus visible, aria-labels, RTL/keyboard support, `prefers-reduced-motion`
- **Dark / Light mode** — Toggle f navbar, persisté f cookie, bla flash (SSR-correct)
- **Blog / CMS-lite** — `/blog` + admin CRUD, contenu FR/AR/EN
- **Docker + CI/CD + Tests** — Dockerfile multi-stage, docker-compose, GitHub Actions (lint/typecheck/test/build), Vitest

Khass wa7ed base de données PostgreSQL bach tkhdem (local via Docker, wla free tier b7al Neon/Supabase/Vercel Postgres — chouf section "Base de données" f taht). Docker howa optionnel, mojoud ila bghiti deploy b conteneur (chouf section "Docker" f taht).

## Kifach Tbda (Installation)

```bash
npm install
cp .env.example .env          # zid DATABASE_URL (chouf section "Base de données")
npx prisma migrate deploy     # kaycree les tables f la base de données
npm run seed                  # kayzra3 categories, atbaq, o comptes demo
npm run dev                   # http://localhost:3000
```

### Base de données (PostgreSQL)

Had le projet kayst3ml PostgreSQL (via Prisma ORM), machi fichier JSON. Bach tkhdem local:

- **Sahel/rapide**: sajel compte b7al [Neon](https://neon.tech) wla [Supabase](https://supabase.com) (free tier, connection string jahza f 30 secondes), o coller-ha f `DATABASE_URL` (`.env`).
- **Docker local**: `docker compose up db` kaytelli3lek Postgres local (chouf `docker-compose.yml`), o `DATABASE_URL="postgresql://darchhiwa:xxx@localhost:5432/darchhiwa?schema=public"`.

Mnin ykoun `DATABASE_URL` mzabout, `npx prisma migrate deploy` (wla `npm run prisma:migrate` f dev) kaycree les tables, o `npm run seed` kayzra3 data.

## Comptes Demo

| Rôle | Email | Password |
|---|---|---|
| Admin | admin@darchhiwa.ma | admin123 |
| Client | client@darchhiwa.ma | client123 |

## Fonctionnalités

### Multilingue (FR / AR / EN)
- Switcher dyal lougha f navbar (🇫🇷 🇲🇦 🇬🇧), tbeddel automatiquement direction dyal page (RTL l 3arabiya)
- Menu, catégories, o contenu dyal restaurant (nom, description...) mtarjmin f les 3 lougha (mn Admin → Paramètres, o Admin → Menu)
- L'admin panel bnafso multilingue

### Paiement Online (Stripe)
- Checkout b **Stripe Checkout** (hosted page) — professionnel, sécurisé, PCI-compliant, bla ma tban informations bancaires l serveur dyalna
- Fallback automatique l "Cash 3nd livraison" ila Stripe ma كانش configuré
- Verification dyal paiement mnin l client kayrj3 mn Stripe (session verification server-side)

**⚠️ Note importante 3la Stripe f Maroc**: Stripe ma تدعمش comptes marchands mباشرة men Maroc. Ila l client 3ndo entité f bled feha Stripe disponible (France, USA, UK, UAE...) khdama mzyan. Ila la, l pattern dyal code (create session → redirect → verify on return) sahl bach tbeddlo l **CMI, PayZone, wla PayTabs** (PSPs maghariba maakhod b compte lokal).

### Site (Storefront)
- Landing page b hero animé, atbaq mokhtarin, section "3la 7na"
- Menu b categories, recherche, filtres
- Panier (cart drawer) b animations
- Checkout: ma3loumat client + **carte interactive** bach tkhtar blasa dyal livraison (Leaflet, bla API key) + choix dyal paiement (Cash 3nd livraison / Carte bancaire b Stripe)
- Confirmation dyal commande b tracking dyal status (animé)
- Comptes clients: sajel/dkhol, tarikh dyal commandes

### Admin Dashboard (`/admin`)
- Statistiques (commandes, chiffre d'affaires, charts b Recharts)
- Gestion dyal Menu: categories + atbaq (CRUD kaml, upload dyal tsawir, contenu FR/AR/EN)
- Gestion dyal Commandes: chouf, beddel status (pending → confirmed → preparing → out for delivery → delivered)
- Paramètres dyal Restaurant: smiya, contact, frais livraison, minimum, horaires... (FR/AR/EN)

## SEO, Sécurité, Accessibilité & Dark Mode

- **SEO**: `src/app/sitemap.ts` o `robots.ts` kaytولدو automatiquement mn l base de données (menu, blog). JSON-LD structured data (Restaurant f homepage, Article f kol article dyal blog, Organization/WebSite f layout). Metadata (title/description/OG/Twitter) dynamique b locale, mbnia f `layout.tsx` o `blog/[slug]/page.tsx`.
- **Sécurité**: Headers dyal sécurité (CSP, HSTS, X-Frame-Options, Referrer-Policy...) mzadin f `next.config.ts`. Rate limiting (in-memory, `src/lib/rate-limit.ts`) 3la login, register, création de commande, o création de session Stripe — bach ma ykono ghir des tentatives محدودة f l minute. **Note**: rate limiting in-memory khdam mzyan l instance wahda; ila deployiti b plusieurs instances (serverless/scale horizontal), khass tbeddlo b Redis (Upstash) wla similar.
- **Accessibilité**: Skip-to-content link, focus ring visible partout, aria-labels 3la les boutons icon-only, `prefers-reduced-motion` respecté, formulaires b labels associés (login/register/checkout).
- **Dark / Light Mode**: Toggle (☀️/🌙) f navbar, cookie `resto-theme`, SSR-safe (bla flash mnin trecharge la page). Couverture kaملة f storefront (navbar, footer, hero, menu, panier); pages checkout/admin baqyin b thème clair — sahl bach tzid `dark:` classes lihoum ila bghiti kaملها.

## Blog / CMS-lite

- Public: `/blog` (liste) o `/blog/[slug]` (article), b JSON-LD Article schema o metadata dynamique.
- Admin: `/admin/blog` — CRUD kamel (titre/extrait/contenu FR-AR-EN, image de couverture b upload, statut publié/brouillon).
- Data model: `BlogPost` f `src/lib/db/types.ts`, fonctions f `src/lib/db/repo.ts` (`getBlogPosts`, `getPublishedBlogPosts`, `createBlogPost`...).

## Docker & Déploiement b Conteneur

```bash
# Build o run b Docker Compose (production-ready)
cp .env.example .env   # zid AUTH_SECRET o STRIPE_SECRET_KEY ila 3andek
docker compose up --build
```

- `Dockerfile` multi-stage (deps → build → runtime Alpine), b Next.js `output: "standalone"` bach l image tkoun sghira.
- `docker-compose.yml` kayzid wa7ed service `db` (Postgres 16) o volume persistant l `public/uploads/` (images) bach ma yt2ay9ouch mnin l conteneur y restart. `web` service kaysenna l `db` ykoun healthy qbel ma ybda, o kaydir `prisma migrate deploy` automatiquement (chouf `CMD` f `Dockerfile`).
- `.dockerignore` kaystbaad `node_modules`, `.next`, o data locale mn l build context.

## CI/CD (GitHub Actions)

`.github/workflows/ci.yml` kayrun automatiquement 3la kol push/PR l `main`:
1. `npm run lint` (ESLint)
2. `npx tsc --noEmit` (typecheck)
3. `npm test -- --run` (Vitest)
4. `npm run build` (production build)
5. `docker build` (verification bach l Dockerfile khdam)

## Tests

```bash
npm test          # Vitest f watch mode
npm test -- --run # Run wa7da (CI mode)
```

Tests kaycouvriw l logique pure: `slugify`, helpers dyal i18n (`localizedField`, `itemName`, `postTitle`...), o cart store (add/remove/subtotal/count). L'objectif howa couverture dyal l business logic li khtira, machi 100% coverage.

## Bghiti Tbi3ha l Client? (Checklist Production)

1. **Beddel l identité**: smiya, logo, couleurs (f `src/app/globals.css`, variables `--brand`, `--gold`, `--accent`), contenu dyal Menu (mn Admin Dashboard wla `scripts/seed.mjs`)
2. **AUTH_SECRET**: dir secret jdid f `.env` — `openssl rand -base64 32`
3. **Stripe**: sajel compte f [dashboard.stripe.com](https://dashboard.stripe.com/register), khod `STRIPE_SECRET_KEY` (test mode l bidaya), zidha f `.env`. Chouf note 3la Maroc f fou9.
4. **Base de données**: PostgreSQL (Prisma). Sajel compte f [Neon](https://neon.tech), [Supabase](https://supabase.com), wla [Vercel Postgres](https://vercel.com/storage/postgres) (free tier kayfaster l bidaya), zid `DATABASE_URL` f environment variables dyal l hosting, o Vercel ghadi ykhdem `prisma migrate deploy` automatiquement (`vercel-build` script). `npm run seed` kayzra3 categories/atbaq/comptes demo.
5. **Images**: uploads kayb9au f `public/uploads` (local disk). L production (Vercel/hosting serverless) khass tbeddelhom l S3/Cloudinary bach ma yt2ay9ouch mnin l serveur y restart. Ila deployiti b Docker/VPS, `docker-compose.yml` kayzid volume persistant `resto-uploads` bach l images ma yt2ay9ouch.
6. **Deploy**: `npm run build && npm run start`, wla deploy f Vercel/Railway/VPS b Node.js 20+. Ila 3andek Stripe, khass tzid `STRIPE_SECRET_KEY` f environment variables dyal l hosting.

## Structure dyal Projet

```
src/
  app/                 → Pages (App Router)
    admin/             → Admin dashboard (menu, orders, blog, settings)
    api/               → API routes (backend)
      checkout/create-session/  → Stripe Checkout session
      admin/blog/                → Blog CRUD
    blog, blog/[slug]  → Blog public (liste + article)
    menu, checkout, order/[id], login, register, account/orders
    sitemap.ts, robots.ts, icon.tsx → SEO
  components/          → UI components (navbar, cart, cards, admin...)
  lib/
    db/                → Data layer (types, store, repo functions)
    i18n/              → Dictionnaires FR/AR/EN, contexte de langue, helpers
    theme/             → Dark/Light mode (cookie-based, SSR-safe)
    stripe.ts          → Client Stripe
    cart-store.ts       → Zustand cart state
    rate-limit.ts       → Rate limiting in-memory
    slugify.ts          → Helper slug (partagé blog + tests)
  auth.ts / auth.config.ts / middleware.ts → Authentification
scripts/seed.mjs        → Seed dyal demo data (FR/AR/EN)
prisma/schema.prisma     → Schéma dyal la base de données (models, relations, indexes)
prisma/migrations/       → Migrations SQL (version-controlled)
Dockerfile, docker-compose.yml → Conteneurisation
.github/workflows/ci.yml → CI/CD
vitest.config.ts, src/**/__tests__/ → Tests
```

## Commandes Disponibles

```bash
npm run dev      # Développement
npm run build    # Build production
npm run start    # Run production build
npm run seed     # Reset/seed data
npm run lint     # ESLint
npm test         # Tests (Vitest)
docker compose up --build   # Run b Docker
```

---
Bslama o bon courage f l bi3! 🚀
