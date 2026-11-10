# Fly Digital client portal

An offline-friendly Node client portal prototype for Fly Digital. The dashboard presents manual CMS work and stored API performance snapshots in one client workspace, with a separate admin view for service and integration health.

## Run locally

```bash
npm start
```

Then open `http://localhost:4173`.

## Next.js frontend

The production-facing frontend is in `next/` and consumes the Node API rather than duplicating its data model. By default, browser calls use same-origin Next routes under `/api/*`; Next forwards those requests to the Node API server-side. This avoids browser `localhost` and CORS mismatches.

```bash
cd next
npm install
npm run dev
```

Open `http://localhost:3000`. The client workspace is `/`; the agency operations view is `/admin`. The Node API includes permissive development CORS headers so the two local ports can work together.

Set `FLY_BACKEND_URL=http://127.0.0.1:4173` for the Next server-side proxy when the backend uses a non-default URL. `NEXT_PUBLIC_API_BASE_URL` is still supported for direct browser-to-backend deployments.

The API endpoints are:

- `GET /api/dashboard`
- `POST /api/sync`
- `POST /api/deliverables/:id/respond`
- `GET /api/admin/overview`

The repository is intentionally in-memory for now. It is shaped so the same methods can be backed by SQLite, Postgres, or another database when persistence is added. Third-party OAuth and platform APIs are represented by stored integration snapshots; credentials are not exposed to the browser.

## Verify

```bash
npm test
npm run build
```

The PDF requirements are captured in `docs/superpowers/specs/2026-11-10-fly-client-portal-design.md` and the implementation sequence is in `docs/superpowers/plans/2026-11-10-fly-client-portal-plan.md`.
