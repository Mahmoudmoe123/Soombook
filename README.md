# Soombook

[![Tests](https://github.com/Mahmoudmoe123/Soombook/actions/workflows/tests.yml/badge.svg)](https://github.com/Mahmoudmoe123/Soombook/actions/workflows/tests.yml)

Soombook is a crowdsourced cross-border delivery platform. Shoppers post products they want from another country, and travelers who are already making that trip pick up the request and bring the item in their luggage, which costs far less than international shipping.

## What it does

- **Sign in with Google** through NextAuth. A user record is created on first login.
- **Post a request** with a product link, price, category, description, photo and pickup location. Photos upload to Supabase Storage.
- **Add a trip** with origin, destination and travel dates, then pick requests that fit the route. At checkout, each accepted order is linked to the trip and its expected arrival date.
- **Get notified**: when a traveler accepts an order, the shopper gets a push notification through Firebase Cloud Messaging and an email through SendGrid.
- **Search and filter** open requests by keyword, category, origin country and price, on phones and desktops.

## Tech stack

Next.js 15 · React 18 · PostgreSQL · Prisma (30+ versioned migrations) · NextAuth · Supabase Storage · Firebase Cloud Messaging · SendGrid · Redux Toolkit · Tailwind CSS · Jest · React Testing Library · GitHub Actions · Docker · Bash · Vercel

## Data model

| Model | Holds |
| --- | --- |
| `User` | Name, email, phone number, notification token |
| `Trip` | Origin and destination countries, departure and arrival dates |
| `Order` | Product link, price, category, image, origin and destination, linked trip, arrival date, pickup location |

The full schema is in [`prisma/schema.prisma`](prisma/schema.prisma).

## Run it locally

1. Copy `.env.example` to `.env` and fill in:
   `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_ID`, `GOOGLE_SECRET`, `FIREBASE_SERVICE_ACCOUNT_KEY` and `SENDGRID_API_KEY`.
2. Install and set up the database:
   ```bash
   npm install
   npx prisma migrate deploy
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

### With Docker

```bash
cp .env.docker.example .env.docker   # then fill in the values
docker compose up --build
```

The app runs at http://localhost:3000.

## Tests

```bash
npm test
```

The suite uses Jest (through `next/jest`) and React Testing Library, and runs on every push and pull request through GitHub Actions. It covers:

| Area | File | What it checks |
| --- | --- | --- |
| Search and filters | `__tests__/lib/orderFilters.test.js` | Keyword search, category, origin, inclusive price ranges, combined filters |
| Basket state | `__tests__/slices/basketSlice.test.js` | Adding, duplicate adds, removing, clearing, totals |
| Filter bar | `__tests__/components/SearchFilters.test.js` | Rendering and the change events the page listens to |
| Orders API | `__tests__/api/getUserOrders.test.js` | 401 when signed out, 404 for an unknown account, only the user's own orders otherwise (NextAuth and Prisma mocked) |
| Health check | `__tests__/api/health.test.js` | 200 when the database answers; 503 when it fails or hangs, without leaking error details; 405 for other methods |
| Logging | `__tests__/lib/logger.test.js` | JSON log lines, log levels, request IDs, and crashes turned into logged 500s |

No database or API keys are needed to run the tests.

## Operations

- **Health check:** `GET /api/health` returns `200` with `{"status":"ok"}` when the app can reach PostgreSQL, and `503` (with no error details) when it can't. The database query times out after 2 seconds so a hung connection fails fast. Docker's `HEALTHCHECK` and the smoke test both use it.
- **Structured logs:** API routes write one JSON line per request (route, method, status, duration, request ID) through `src/lib/logger.js`. Every response has an `X-Request-Id` header, and unexpected errors return a 500 that includes the ID, so a user's report can be matched to the exact log line.
- **Smoke test:** `scripts/smoke-test.sh <url>` checks the health endpoint, the home page, and that the orders API rejects signed-out requests, with retries. It exits non-zero on failure.
- **Uptime check:** the `Uptime check` GitHub Actions workflow runs the smoke test against the live site every hour once the `SOOMBOOK_URL` repository variable is set. GitHub emails a notice when a run fails.
- **Runbook and incident reviews:** [`docs/RUNBOOK.md`](docs/RUNBOOK.md) covers what to check when something breaks and how to roll back. [`docs/postmortems/`](docs/postmortems/) holds post-incident reviews, starting with [the orders API 500 errors](docs/postmortems/2026-10-14-orders-api-500.md).

## Acknowledgments

The first version started from Sonny Sangha's open-source Next.js and Redux Toolkit starter. Everything trip-, order- and notification-related was built on top of it.
