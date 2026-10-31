# WALKZY

WALKZY is a mobile-first hyperlocal delivery MVP for gated communities. It connects customers with local merchants and verified walkers who are already travelling nearby.

## Run on Windows

1. Install Node.js 20 LTS.
2. In PowerShell, run `npm install`.
3. Copy `.env.example` to `.env.local` and set `SESSION_SECRET` to a random value.
4. Run `npm run dev`.
5. Open http://localhost:3000.

The demo sign-in is available at `/auth`. Dashboards require a signed, HTTP-only demo session. Demo accounts are shown on the sign-in screen and are development-only.

## Current foundation

- Responsive marketing page and role-specific dashboard experiences.
- Server API endpoint that rejects invalid order state transitions.
- Transparent route matching service with pickup, detour, and weight limits.
- Demo data clearly presented as sample data.
- Environment variables are kept server-side; payment and map providers are adapter-ready.

## Production roadmap

The next hardening step is to add PostgreSQL/Prisma persistence, secure session authentication, verification workflows, transactional inventory updates, and real payment/web-push providers. The current demo intentionally does not claim that its straight-line matching is pedestrian routing.

## Validation

`npm run build` validates the Next.js application. Domain behavior is covered in `tests/domain.test.mjs`; the test file should be run after TypeScript test transpilation is configured in the production test harness.
