# Fly Digital Client Portal — Handoff Report

## Purpose

This document is a handoff for the next AI agent continuing the Fly Digital client dashboard project. It records what exists, what has been verified, current limitations, and recommended next steps.

## User brief

The user requested a client dashboard for Fly Digital inspired by:

`https://marketing-agency-cli-uk4l.bolt.host/`

The user also supplied `dashboard-pdf.pdf`, which defines the product and backend requirements.

The reference website could not be opened from the available browser/network environment, so the current visual direction was based on the user's URL plus the PDF requirements.

## Requirements extracted from the PDF

The portal must present one seamless client experience even though data comes from two sources:

1. Manual CMS-managed updates for agency-controlled work.
2. API-backed performance data from external platforms.

The seven services are:

- Branding
- Website Development
- PPC & SEO
- Social Media Marketing
- Digital Campaign
- Creative Production
- Influencer Marketing

The PDF also specifies:

- Centralized client portal and client authentication concept.
- Backend-owned API synchronization; the frontend should not call Meta or Google directly.
- Stored performance snapshots for faster loading and historical reporting.
- Last-synchronized timestamps.
- Suggested scheduled sync intervals, manual sync, and webhooks where supported.
- Platform data sources: Meta Graph API, Google Ads API, Google Analytics Data API, and Google Search Console API.
- Secure token storage requirements for the future implementation.
- Manual deliverable workflow: publish work, notify the client, allow approval or revision comments, and record the response.
- Separate agency admin/CMS view for clients, services, integrations, projects, deliverables, approvals, and billing.

## Current architecture

The project currently has two frontend options consuming one Node backend:

### 1. Dependency-free static frontend

The original prototype is served by the Node server from `public/`.

- `public/index.html`
- `public/app.js`
- `public/styles.css`

This version works without npm dependencies and is useful as a fallback or visual reference.

### 2. Next.js frontend

The Next.js App Router frontend is in `next/`.

- `next/app/page.tsx` — client workspace route `/`
- `next/app/admin/page.tsx` — admin route `/admin`
- `next/app/api/[...path]/route.ts` — same-origin proxy from Next to the Node API
- `next/components/portal-shell.tsx` — main client-side UI and interactions
- `next/lib/api.ts` — typed API client
- `next/lib/types.ts` — shared frontend data types
- `next/app/globals.css` — imports the existing Fly stylesheet and adds Next-specific tone aliases
- `next/package.json` — Next/React/TypeScript dependencies and scripts
- `next/.env.example` — API base URL example
- `next/next.config.mjs` — strict-mode Next config
- `next/tsconfig.json` — strict TypeScript config

The Next frontend intentionally consumes the Node API instead of duplicating the data model.

### Backend

The Node backend uses only built-in Node modules:

- `server/index.js` — HTTP server, static file serving, API routing, CORS headers
- `server/repository.js` — in-memory repository and mock data
- `server/repository.test.js` — Node test runner tests

The repository is intentionally shaped so it can later be replaced with SQLite, Postgres, or another database without changing the frontend contract.

## Backend API contract

### `GET /api/dashboard`

Returns the full client dashboard payload:

```js
{
  client,
  performance,
  services,
  deliverables,
  activity,
  integrations
}
```

### `POST /api/sync`

Returns the updated dashboard payload after simulating a performance sync. It increments the score up to 99, updates `performance.lastSyncedAt`, and adds a sync event to `activity`.

### `POST /api/deliverables/:id/respond`

Expected body:

```json
{
  "status": "approved",
  "comment": "Optional client comment"
}
```

`status` can be `approved` or `revision`. The repository stores `approved` or `revision requested` as the deliverable status and records an activity event.

### `GET /api/admin/overview`

Returns the admin-focused payload:

```js
{
  client,
  services,
  integrations,
  deliverables,
  pendingApprovals,
  lastSyncedAt
}
```

### CORS

The Node server sends permissive development CORS headers:

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Headers: Content-Type`
- `Access-Control-Allow-Methods: GET,POST,OPTIONS`

This allows the Next dev server on port `3000` to consume the API on port `4173`.

## Next.js frontend behavior

The API is consumed through the same-origin Next proxy by default. Browser requests use `/api/*`; the proxy forwards them to the Node API using `FLY_BACKEND_URL` or the default `http://127.0.0.1:4173`.

The optional direct-browser API base URL is configured with:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4173
```

If the variable is not set, `next/lib/api.ts` uses same-origin requests and avoids browser `localhost`/CORS problems.

Current interactions:

- Workspace loads from `GET /api/dashboard`.
- Admin loads from `GET /api/admin/overview`.
- “Sync data” calls `POST /api/sync`.
- “Sync all sources” calls `POST /api/sync`, then reloads the admin overview.
- Deliverable response dialog calls `POST /api/deliverables/:id/respond`.
- Approval and revision responses show a toast notification.
- The dashboard includes a score ring, performance metric strip, SVG chart, seven service cards, deliverables, activity feed, integration state, and responsive layouts.
- The admin view includes client summary, service count, integration count, pending approvals, connected platforms, and service coverage.

## Visual system

The design uses a Fly-specific editorial studio direction:

- Ink: `#151515`
- Paper: `#F5F3EE`
- Panel: `#FFFEFA`
- Signal blue: `#2369FF`
- Fly lime: `#C7F45B`
- Alert coral: `#FF846A`
- Rule: `#D8D5CD`

The memorable visual element is the circular momentum score ring. The rest of the interface stays quiet and editorial with asymmetric spacing, compact cards, soft rules, and left-aligned content.

Typography is intended to use `DM Sans` for UI text and `Space Grotesk` for display/numeric moments. The stylesheet includes a Google Fonts import with system fallbacks.

## Commands

From the project root:

```bash
npm test
npm run build
npm start
```

Root scripts:

- `npm start` — starts the Node API/static server on port `4173`.
- `npm test` — runs `node --test`.
- `npm run build` — syntax-checks the backend and static frontend JavaScript.
- `npm run next:dev` — delegates to `next/` and runs Next dev on port `3000`.
- `npm run next:build` — delegates to the Next app build.
- `npm run next:start` — starts the built Next app on port `3000`.

For the Next frontend directly:

```bash
cd next
npm install
NEXT_PUBLIC_API_BASE_URL=http://localhost:4173 npm run dev
```

Open:

- `http://localhost:3000/` — client workspace
- `http://localhost:3000/admin` — admin view

## Verification completed

The following commands were run successfully from the project root:

```text
npm test
```

Result: 3 tests passed.

The tests cover:

1. Seven services and stored performance snapshot shape.
2. Sync timestamp change and sync activity event.
3. Deliverable revision response state and activity event.

```text
npm run build
```

Result: `node --check server/index.js` and `node --check public/app.js` passed.

Additional checks passed for:

- `server/index.js`
- `server/repository.js`
- `public/app.js`

The Next production build was run successfully with Next `16.4.6`. It compiled, passed TypeScript, generated `/`, `/admin`, and the dynamic `/api/[...path]` proxy route. Next emitted a warning that React 18 support is deprecated in Next 16; upgrading React to 19 is a future cleanup.

The sandbox also rejected starting a listening TCP server with `EPERM`, so live browser/API verification was not possible inside this environment. The server is intended to run normally on a local machine.

## Known limitations

- Repository data is in-memory and resets when the Node process restarts.
- No real authentication or role-based access control is implemented.
- No real OAuth or Meta/Google integrations are connected.
- No token encryption, refresh, revocation detection, or account onboarding flow exists yet.
- No scheduler, cron job, webhook handler, or persistent sync history exists yet.
- The Next frontend currently uses a single client component for most dashboard UI; it can be split into smaller components later.
- The static `public/` frontend and Next frontend currently coexist; the Next frontend is the intended production-facing frontend.
- The Google Fonts import may require network access; system fallbacks are present.
- The frontend uses mock values such as Northstar Home, Maya Patel, and sample metrics.

## Recommended continuation order

1. Install Next dependencies in `next/` and run `npm run build`.
2. Start the Node API and Next dev server together; verify `/` and `/admin` in a browser.
3. Fix any Next CSS import/build issues caused by importing `../../public/styles.css`; if needed, copy the shared style tokens into `next/app/globals.css`.
4. Add proper API integration tests for the HTTP routes, including CORS preflight and invalid deliverable IDs.
5. Add a database adapter, preferably SQLite first for local development.
6. Add authentication and client/admin authorization before exposing the app beyond local development.
7. Replace mock integrations with server-side OAuth/account connection flows.
8. Add sync job persistence, last-successful-sync tracking, and stale-data/error states.
9. Add file upload/storage for deliverables and notifications for new approvals/revisions.
10. Add component-level tests and visual QA at desktop and mobile widths.

## Important implementation notes

- Keep external platform credentials server-side. Never move API tokens into `next/lib/api.ts` or client components.
- Keep the frontend reading stored snapshots from the Node backend. Do not call Meta, Google Ads, Analytics, or Search Console directly from the browser.
- Preserve the shared payload shape when replacing the in-memory repository so the Next frontend does not need to change.
- The current Node server binds to `127.0.0.1` and defaults to port `4173`; use `PORT` to override it.
- The current project is not a git repository, so there are no commits or branches to recover from. The files in this workspace are the source of truth.
