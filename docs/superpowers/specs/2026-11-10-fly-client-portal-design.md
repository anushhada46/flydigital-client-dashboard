# Fly Client Portal Design

## Intent

Build a polished client-facing relationship and project portal for Fly Digital. A client should land on one calm workspace and understand the health of their work, the performance of connected channels, what needs their attention, and what is coming next without knowing whether a number came from the CMS or an external platform.

## Goals

- Recreate the reference's focused, agency-grade dashboard feel with a stronger Fly identity.
- Make manual deliverables and API-backed performance read as one coherent experience.
- Represent all seven services from the brief: Branding, Website Development, PPC & SEO, Social Media Marketing, Digital Campaign, Creative Production, and Influencer Marketing.
- Provide a credible local Node implementation with a mock API and a replaceable database boundary.
- Include the client-side approval/revision loop for manual deliverables.
- Show sync health, last-updated timestamps, and source badges so stale data is visible.
- Include a working admin view for clients, services, integrations, and deliverables.

## Non-goals for this iteration

- Real OAuth connections or production access-token storage.
- Real Meta, Google Ads, Analytics, or Search Console API calls.
- Billing execution, payment processing, or account provisioning.
- A full CMS editor or file upload pipeline.

## Product shape

The first screen is a client workspace with a left rail, a greeting, a single “needs your attention” action area, a performance strip, and a 30-day performance chart. Below it, the services grid makes the seven service workflows legible. A deliverables panel exposes approval and revision actions. The admin route is a compact operational view that surfaces clients, active services, connected accounts, and sync status.

## Data architecture

Use a Node/Express API with a simple in-memory repository for now, shaped like a future relational database. The repository exposes clients, services, deliverables, metrics, integrations, and activity. API-backed metric cards read only from stored snapshots. Manual updates are written as deliverable records. A sync endpoint updates the snapshot timestamp and values; no frontend component calls a third-party platform.

## Interaction requirements

- Service filters switch the visible service set without a page reload.
- A deliverable can be approved or sent back for revision with a comment.
- “Sync data” updates the visible timestamp and shows a transient confirmation.
- Admin/client navigation switches between `/` and `/admin`.
- Cards and controls have visible focus states and keyboard-accessible buttons.
- Responsive behavior collapses the rail and turns dense grids into single-column sections on narrow screens.

## Visual direction

Fly should feel like a studio with a point of view: ink-black typography, washed parchment, a bright “signal blue” accent, acid-lime status moments, and a punched coral for attention. The memorable element is the hand-drawn-style circular progress marker around the headline score; other surfaces stay quiet and editorial rather than looking like a generic SaaS card kit.

### Tokens

- Ink: `#151515`
- Paper: `#F5F3EE`
- Panel: `#FFFEFA`
- Signal blue: `#2369FF`
- Fly lime: `#C7F45B`
- Alert coral: `#FF846A`
- Rule: `#D8D5CD`

Type uses `DM Sans` for interface text and `Space Grotesk` for large numbers and display moments. Layout is left-aligned, with a wide content column and asymmetric emphasis rather than identical tiles.

## Acceptance criteria

- The app starts with one command and serves a working client portal.
- The home view renders the seven services, performance metrics, chart, next milestone, deliverables, source status, and last sync time.
- Both manual and API-backed records come from the Node API layer.
- Approve/revision and sync interactions change application state visibly.
- Admin view exposes client/service/integration/deliverable summaries.
- Responsive layout is usable at desktop and mobile widths.
- Build and tests pass.
