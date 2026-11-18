## Card layout rule

Use independent vertical card stacks for desktop columns throughout this project unless the user explicitly requests another layout. Keep natural card heights and a consistent gap; do not align cards across shared rows, equalize heights, or use negative offsets to close gaps.

When columns collapse on smaller screens, use one stack in this order: Active Services, Pending Approvals, Recent Activity, Billing, Recent Reports, Upcoming Deliverables, Latest Messages, Your Fly Team. Preserve the existing desktop placement: services/activity/deliverables on the left; approvals/billing/reports/messages/team on the right.

## Stylesheet organization

Keep component-specific styles in a matching, colocated `*.module.css` file, imported by its owning component. This includes sidebar, top bar, dashboard, onboarding, and services styles. `app/globals.css` is reserved for shared design tokens, resets, typography, and application layout foundations.

Do not collect unrelated component rules in one stylesheet or import component CSS from the root layout. Keep CSS formatted with one declaration per line. Prefer component props and scoped variants over styling another component's internals from a page stylesheet. Preserve the existing design and responsive behavior when reorganizing styles.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
