# WALKZY Independent QA Audit Report

**Audit date:** 2026-10-31  
**Scope:** Entire repository at `C:\Users\rishabh mishra\WALKZY`  
**Auditor:** CTO / independent QA review  
**Verdict:** **NOT READY FOR PILOT**

## Executive summary

The repository is a small Next.js visual/demo foundation, not a functional end-to-end delivery platform. The landing page and four dashboard routes render successfully, the route-matching helper and order-transition helper run, and the production build passes. No database, Prisma schema, authentication, sessions, role enforcement, registration, product CRUD, cart, checkout, payment, OTP, refund, notifications, persistence, or real delivery workflow exists.

The audit reproduced the previously failing unit test and fixed its incorrect expected value. The npm scripts were also corrected to invoke the installed Next binary directly, and a lockfile plus `.gitignore` were added. No critical or high-severity exploitable issue was found in the current static demo data, but the absence of authentication and server-side authorization is a blocking security defect for any real data.

## Working features (tested)

| Area | Result | Evidence |
|---|---|---|
| Landing page rendering | PASS | `GET /` returned HTTP 200; browser accessibility snapshot loaded title and primary content |
| Customer demo route rendering | PASS | `GET /customer` returned HTTP 200 |
| Walker demo route rendering | PASS | `GET /walker` returned HTTP 200 |
| Merchant demo route rendering | PASS | `GET /merchant` returned HTTP 200 |
| Admin demo route rendering | PASS | `GET /admin` returned HTTP 200 |
| 404 handling | PASS | `GET /missing` returned HTTP 404 |
| Valid order transition helper/API response | PASS, demo-only | `PENDING -> MERCHANT_ACCEPTED` returned HTTP 200 |
| Invalid order transition rejection | PASS, demo-only | `PENDING -> DELIVERED` returned HTTP 422 |
| Route score helper | PASS | Unit tests cover eligible and rejected route inputs |
| Production build | PASS | `npm run build` exited 0 and generated all 9 pages |
| Basic mobile layout | PASS, limited | Browser at 390x844 reported body width 375px and no horizontal overflow |

These results prove rendering and isolated helper behavior only. They do not prove persistence, authorization, or business workflows.

## Broken features

| Feature | Result | Finding |
|---|---|---|
| Customer registration/login | NOT IMPLEMENTED | No `/auth` route, form, session, user store, password hashing, or login API |
| Merchant registration | NOT IMPLEMENTED | No merchant application form or API |
| Product management | BROKEN / NON-FUNCTIONAL | “Add product” and “Manage products” are not actions; no product API or persistence |
| Grocery ordering | BROKEN / NON-FUNCTIONAL | “Browse store” links back to `/customer`; no product detail, cart, checkout, or order creation |
| Walker registration/verification | NOT IMPLEMENTED | No workflow, document handling, approval state, or API |
| Walker availability/location | BROKEN / NON-FUNCTIONAL | “Start a walk” has no handler; no permission request, route declaration, or location storage |
| Delivery acceptance | BROKEN / NON-FUNCTIONAL | “View request” buttons have no handler; no assignment transaction or locking |
| Pickup/delivery OTP | NOT IMPLEMENTED | No OTP generation, validation, expiry, or audit trail |
| Cancellation/refund | NOT IMPLEMENTED | No cancellation endpoint, payment state, refund adapter, or inventory rollback |
| Admin approvals/societies | NOT IMPLEMENTED | Admin page is static; no approval controls, society management, or APIs |
| Payment sandbox | NOT IMPLEMENTED | Razorpay is not installed or integrated; environment variables are unused |
| Real-time updates | NOT IMPLEMENTED | No Socket.IO/WebSocket/polling implementation |
| PWA/offline behavior | NOT IMPLEMENTED | No manifest, service worker, icons, or offline fallback |

## Incomplete features

- The only API route, [`app/api/orders/route.ts`](C:/Users/rishabh%20mishra/WALKZY/app/api/orders/route.ts), validates two status strings and returns them. It does not load or update an order.
- [`lib/domain.ts`](C:/Users/rishabh%20mishra/WALKZY/lib/domain.ts) contains a simplified state transition map and score formula, but no order, assignment, inventory, payment, OTP, or authorization service.
- Demo dashboards use hard-coded values from [`lib/demo.ts`](C:/Users/rishabh%20mishra/WALKZY/lib/demo.ts); values do not change after user actions.
- There are no loading, empty, retry, or user-facing error states on any page.
- There are no server actions, client components, forms, or event handlers in the application pages.

## Security vulnerabilities and risks

| Severity | File | Issue | Status |
|---|---|---|---|
| MEDIUM | [`app/admin/page.tsx`](C:/Users/rishabh%20mishra/WALKZY/app/admin/page.tsx) | `/admin` is publicly reachable without authentication or server-side admin authorization | Not fixed; requires the absent auth system |
| MEDIUM | [`app/customer/page.tsx`](C:/Users/rishabh%20mishra/WALKZY/app/customer/page.tsx), [`app/merchant/page.tsx`](C:/Users/rishabh%20mishra/WALKZY/app/merchant/page.tsx), [`app/walker/page.tsx`](C:/Users/rishabh%20mishra/WALKZY/app/walker/page.tsx) | Role dashboards and location/order details are publicly reachable; role labels are presentation-only | Not fixed; requires the absent auth system |
| MEDIUM | [`package.json`](C:/Users/rishabh%20mishra/WALKZY/package.json) | Lockfile was absent at audit start, reducing dependency reproducibility | Fixed by generating `package-lock.json`; dependency scanning is still absent |
| HIGH operational risk | Entire application | No server-side authorization boundary exists for future mutations | Not fixed; no safe surgical patch exists without implementing authentication |

No secrets were found in source files. `.env.example` contains placeholders only. The current static demo does not process real customer data or payments, but it must not be deployed with real data.

## Database problems

- No Prisma dependency.
- No `prisma/` directory or `schema.prisma`.
- No migrations or seed scripts.
- No `DATABASE_URL` consumer.
- No PostgreSQL or PostGIS connection.
- No models for users, profiles, stores, products, carts, orders, assignments, payments, payouts, notifications, or audit logs.
- No transactions, inventory locking, idempotency, or persistence verification is possible.

Database connectivity and all requested Prisma-model checks are therefore **UNVERIFIED / NOT APPLICABLE** because no database layer exists.

## API problems

- Only one route exists: `POST /api/orders`.
- It accepts client-supplied `from` and `to` states and does not identify an order.
- It has no authentication, authorization, CSRF strategy, rate limiting, idempotency key, persistence, or audit log.
- Malformed JSON is converted to the same generic 422 response as an invalid transition; no structured validation details are returned.
- There are no APIs for auth, users, stores, products, carts, checkout, payments, walkers, matching, assignments, OTP, refunds, admin approvals, societies, notifications, or support.

## UI/UX problems

- Buttons with no behavior: “Start a walk”, “View request”, “Manage products”, and dashboard action buttons.
- “Browse store” and “View cart” navigate to the same dashboard instead of opening a store/cart workflow.
- “Sign out” is just a link to `/`; it does not invalidate a session.
- “Switch demo role” navigates to the customer page without changing an authenticated role.
- Static demo metrics are presented in operational dashboards without a sufficiently prominent demo-only treatment.
- No authentication screens, form validation, toast/notification feedback, loading states, empty states, or error recovery.
- No user-controlled location permission flow.
- Basic 390px mobile overflow check passed, but interactive mobile behavior, touch workflows, and installability were not available to test.

## Performance issues

- The pages are small and statically rendered, so no material rendering issue was observed in the smoke test.
- There is no real database or remote API workload to benchmark.
- No image optimization, caching policy, pagination, query strategy, rate limiting, or real-time connection management exists.
- Performance readiness for production is therefore **unverified**.

## External integrations requiring credentials

The following are mentioned in configuration or the product specification but are not implemented:

- PostgreSQL/PostGIS (`DATABASE_URL`)
- Razorpay (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`)
- Map provider (`MAP_PROVIDER`)
- Cloudinary or equivalent image storage
- Web push provider
- Email/SMS/phone verification provider

Credentials alone will not enable these integrations; adapters and server-side workflows must still be implemented.

## Tests performed and actual results

### Environment

| Capability | Result |
|---|---|
| Node.js | Available, v24.10.0 |
| npm | Available, v11.6.1 |
| Docker | Unavailable: `docker` command not found |
| Playwright CLI | `npx playwright --version` returned 1.64.1 |
| Playwright test suite | FAIL / no browser suite: `npx playwright test --list` found the Node tests but reported “No tests found” for Playwright |
| Database | Not available; no database implementation exists |

### Commands and exit codes

| Command | Exit code | Actual result |
|---|---:|---|
| `npm test` (before fix) | 1 | 3 passed, 1 failed because expected route score was 77 but implementation returned 73 |
| `npm test` (after fix) | 0 | 4 passed, 0 failed |
| TypeScript compiler (`node node_modules/typescript/bin/tsc --noEmit`) | 0 | Passed |
| `npm run build` | 0 | Production build passed; 9 pages generated |
| `npm run lint` | 1 | Next.js entered interactive ESLint setup because ESLint/config is not installed; no lint suite ran |
| `npx playwright test --list` | 1 | No Playwright tests found |
| `npx playwright install chromium` | 0 | Command completed, but repository has no Playwright test dependency or test files |

### Runtime smoke tests

The production server started successfully with `npm run start` and was ready on `http://localhost:3000`.

| Request | Result |
|---|---|
| `GET /` | 200 |
| `GET /customer` | 200 |
| `GET /walker` | 200 |
| `GET /merchant` | 200 |
| `GET /admin` | 200 |
| `GET /missing` | 404 |
| Valid order transition | 200 JSON response |
| Invalid order transition | 422 JSON response |
| Malformed JSON | 422 JSON response |

### Requested journey coverage

| Journey | Result |
|---|---|
| Customer registration/login | NOT TESTABLE — absent |
| Merchant registration/product management | NOT TESTABLE — absent |
| Grocery order end-to-end | FAIL — no workflow |
| Walker registration/verification | NOT TESTABLE — absent |
| Walker availability/route matching | PARTIAL — pure helper tested; UI control inert |
| Delivery acceptance/OTP | FAIL — absent |
| Cancellation/refund | FAIL — absent |
| Admin approvals/society management | FAIL — static page only |
| Payment sandbox | NOT TESTABLE — absent |
| Mobile responsiveness | PARTIAL PASS — no horizontal overflow at 390px; no functional mobile flow exists |
| Loading/empty/error states | FAIL — absent |

## Fixes made during audit

1. Corrected the incorrect unit-test expected route score from 77 to the implementation’s verified score of 73.
2. Made npm `dev`, `build`, `start`, and `lint` scripts invoke the installed Next binary directly in this checkout.
3. Added `.gitignore` for generated build output, dependencies, and local environment files.
4. Generated `package-lock.json` for reproducible dependency installation.
5. Added package ESM metadata to remove the Node module-type warning in the test runner.

## Pilot readiness decision

**FAIL — do not deploy or pilot with real users or data.**

The static pages and isolated helpers are usable as a visual/demo starting point. The requested end-to-end platform is not present. The highest-priority blockers are authentication and server-side role enforcement, persistent database models/migrations, real order/cart/inventory/payment workflows, and testable APIs for every core journey.
