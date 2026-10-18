# Utkristi — Portfolio of Utkarsh Gupta

Personal portfolio and CMS built with **Next.js 15 (App Router)**, **Tailwind CSS**, **shadcn/ui** and a **Neon Postgres** database via **Drizzle ORM**. Everything on the site — projects, case studies, articles, experience, certifications, testimonials, skills and the `/now` and `/uses` pages — is editable from a password-protected admin.

## Features

**Site**
- Editorial design with light/dark themes (follows the visitor's system setting until they choose)
- Motion: first-visit intro loader, scroll reveals, character/word text animations, pinned project showcase, magnetic buttons, cursor spotlight — all disabled for `prefers-reduced-motion`
- Project popup with previous/next navigation, plus case-study pages at `/projects/<slug>` for projects that have one
- On-site articles at `/blog/<slug>` (Markdown with syntax highlighting, table of contents, reading progress, previous/next); posts without a body link to where they're published
- Experience timeline with Work / Education filter, certifications, testimonials, live GitHub / LeetCode / Codeforces stats and a GitHub contribution graph
- `⌘K` / `Ctrl+K` command palette and an interactive terminal (`Ctrl + backtick`)
- SEO: per-page metadata, Open Graph images (site-wide and per project), JSON-LD structured data, `sitemap.xml`, `robots.txt`, RSS at `/feed.xml`

**Admin (`/admin`)**
- Edit hero, about, skills, experience, certifications, projects, articles, testimonials and `/now` / `/uses`
- Markdown editor with live preview and local draft autosave
- Published / Draft / Archived status with one-click toggles and draft previews (`?preview=1`)
- Drag-to-reorder lists; "Start from a GitHub repo" import for new projects
- Contact-form inbox with replies sent by email (Brevo)

**Security**
- Signed, expiring session cookies; every admin action re-checks the session and validates input (zod)
- Optional two-factor login (authenticator app codes)
- Rate limiting on login and the contact form; honeypot spam field; HTML-escaped emails

## Getting started

Requires **Node.js 22** and a Postgres database (the project uses [Neon](https://neon.tech)).

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run db:migrate           # create/upgrade tables (safe to re-run)
npm run dev                  # http://localhost:9002
```

The admin is at [http://localhost:9002/admin](http://localhost:9002/admin) and uses `ADMIN_PASSWORD`.

## Environment variables

See [`.env.example`](.env.example) for the full list. Never commit real values.

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Postgres / Neon connection string |
| `ADMIN_PASSWORD` | Yes | Admin login password |
| `ADMIN_SESSION_SECRET` | No | Signs admin sessions (falls back to `ADMIN_PASSWORD`) |
| `ADMIN_TOTP_SECRET` | No | Enables two-factor login — generate with `npm run admin:2fa` |
| `IMGBB_API_KEY` | For uploads | Image hosting for admin uploads |
| `BREVO_API_KEY`, `ADMIN_EMAIL` | For email | Contact-form notifications and inbox replies |
| `GITHUB_TOKEN` | Recommended | Raises GitHub's API limit (repo stats, repo import) from 60 to 5,000 requests/hour |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL for metadata, sitemap and RSS (default `https://utkristi.com`) |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics; Analytics and click events load only when set |
| `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN` | No | Error monitoring; the Sentry SDK loads only when set |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server on port 9002 |
| `npm run build` / `npm run start` | Production build / serve it |
| `npm run typecheck` | TypeScript check |
| `npm run db:migrate` | Apply database migrations ([`src/db/migrate-v2.ts`](src/db/migrate-v2.ts)); additive and idempotent |
| `npm run test:e2e` | Playwright end-to-end and accessibility tests (desktop + mobile) |
| `npm run admin:2fa` | Generate a two-factor secret and setup link for the admin login |

First time running the tests, install the browser: `npx playwright install chromium`. Locally the tests reuse a running `npm run dev`; they only read data and never submit forms.

## Project structure

```
src/
├── app/                  # Routes (App Router)
│   ├── admin/            # CMS screens + server actions (actions.ts)
│   ├── api/              # Login/logout, image upload, seed
│   ├── projects/[slug]/  # Case-study pages (+ per-project OG image)
│   ├── blog/[slug]/      # On-site articles
│   ├── now/, uses/       # Markdown pages managed in the admin
│   └── feed.xml, sitemap.ts, robots.ts, opengraph-image.tsx
├── components/
│   ├── sections/         # Page sections (hero, timeline, showcase, …)
│   ├── admin/            # Admin forms and helpers
│   ├── ui/               # Shared UI, motion primitives, terminal, command palette
│   └── seo/              # JSON-LD structured data
├── db/                   # Drizzle schema, cached queries, migration
├── lib/                  # Auth, validation, rate limiting, TOTP, analytics, helpers
└── middleware.ts         # Protects /admin and admin APIs
tests/e2e/                # Playwright tests (site, security, accessibility)
```

## Content caching

Public content queries are cached and shared across requests; any admin save clears the cache, so edits appear immediately. Changes made directly in the database (outside the admin) show up within an hour or after the next admin save.

## Continuous integration

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs the typecheck, a production build and the full test suite on every push to `main` and on pull requests. Add `DATABASE_URL` and `ADMIN_PASSWORD` as repository secrets (Settings → Secrets and variables → Actions). A separate Neon branch for CI is recommended so tests never touch production data.

## Deployment

Configured for **Firebase App Hosting** ([`apphosting.yaml`](apphosting.yaml)); any Node host that runs `next start` works. Set the environment variables above in your hosting provider and run `npm run db:migrate` against the production database before deploying a version that adds tables or columns.

## License

See [LICENSE](LICENSE).
