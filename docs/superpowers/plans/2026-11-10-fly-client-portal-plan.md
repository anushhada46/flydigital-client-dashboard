# Fly Client Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive Fly Digital client portal and admin surface backed by a local Node API with repository-shaped mock data.

**Architecture:** A Vite React client consumes a small Express server. The server owns a repository of clients, services, integrations, metrics, deliverables, and activity; the client only renders and mutates through API routes. The repository is in-memory for now and intentionally maps cleanly to a future relational database.

**Tech Stack:** Node.js, Express, React, Vite, TypeScript, Vitest, CSS.

**Spec:** `docs/superpowers/specs/2026-11-10-fly-client-portal-design.md`

## Global Constraints

- One seamless portal must hide whether information came from manual CMS updates or an API.
- The seven services must be represented.
- API data must be stored in the backend snapshot and display last-synced time.
- Client approval/revision behavior must be visible and stateful.
- No real third-party credentials or API calls in this iteration.

## Review Focus

- Empty or stale deliverables: show a useful empty state and source/status detail.
- Sync failure: preserve the last good snapshot and show a clear error state.
- Narrow screens: keep the primary action and navigation usable.
- Long revision comments: keep the input and resulting activity readable.
- Mixed manual/API services: preserve the distinction in source labels without splitting the experience.

### Task 1: Project foundation and repository API

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`
- Create: `server/index.ts`, `server/repository.ts`, `server/data.ts`
- Test: `server/repository.test.ts`

**Interfaces:**
- `repository.getDashboard(): DashboardPayload`
- `repository.syncPerformance(): DashboardPayload`
- `repository.respondToDeliverable(id: string, response: {status: 'approved'|'revision'; comment: string}): DashboardPayload`

- [ ] Write repository tests for dashboard shape, sync timestamp change, and approval/revision state.
- [ ] Run the tests and confirm they fail because the repository does not exist.
- [ ] Implement typed mock data and Express JSON routes: `GET /api/dashboard`, `POST /api/sync`, `POST /api/deliverables/:id/respond`, and `GET /api/admin/overview`.
- [ ] Run the tests and confirm they pass.

### Task 2: Client shell and design system

**Files:**
- Create: `src/main.tsx`, `src/App.tsx`, `src/api.ts`, `src/types.ts`
- Create: `src/styles.css`, `src/components/Icon.tsx`, `src/components/Sidebar.tsx`, `src/components/Topbar.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- `api.getDashboard(): Promise<DashboardPayload>`
- `api.syncPerformance(): Promise<DashboardPayload>`
- `api.respondToDeliverable(id, response): Promise<DashboardPayload>`

- [ ] Write a client smoke test for the seven service names and the dashboard heading.
- [ ] Run it and confirm it fails.
- [ ] Implement the app shell, typed API client, responsive rail, topbar, and the intentional Fly token system.
- [ ] Run the test and confirm it passes.

### Task 3: Client dashboard modules

**Files:**
- Create: `src/components/OverviewHero.tsx`, `src/components/MetricStrip.tsx`, `src/components/PerformanceChart.tsx`
- Create: `src/components/ServicesGrid.tsx`, `src/components/DeliverablesPanel.tsx`, `src/components/ActivityFeed.tsx`
- Modify: `src/App.tsx`, `src/styles.css`
- Test: `src/components/DashboardModules.test.tsx`

- [ ] Write tests for service filter changes, visible source badges, and deliverable response controls.
- [ ] Run them and confirm they fail.
- [ ] Implement the modules, chart, filter state, approval/revision dialog, loading/empty/error states, and sync feedback.
- [ ] Run the tests and confirm they pass.

### Task 4: Admin route and integration status

**Files:**
- Create: `src/components/AdminView.tsx`
- Modify: `src/App.tsx`, `src/styles.css`
- Test: `src/components/AdminView.test.tsx`

- [ ] Write a test for admin client, service, integration, and pending-approval summaries.
- [ ] Run it and confirm it fails.
- [ ] Implement the admin view and client/admin route toggle without introducing a second data model.
- [ ] Run the test and confirm it passes.

### Task 5: Verification and visual QA

**Files:**
- Modify: `README.md`

- [ ] Run the full test suite.
- [ ] Run the production build.
- [ ] Start the app and inspect desktop and mobile rendering with a browser screenshot when available.
- [ ] Verify all acceptance criteria against the spec and document local start/API commands.
