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

Next.js 15 · React 18 · PostgreSQL · Prisma (30+ versioned migrations) · NextAuth · Supabase Storage · Firebase Cloud Messaging · SendGrid · Redux Toolkit · Tailwind CSS · Jest · React Testing Library · GitHub Actions · Docker · Vercel

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

No database or API keys are needed to run the tests.

## Acknowledgments

The first version started from Sonny Sangha's open-source Next.js and Redux Toolkit starter. Everything trip-, order- and notification-related was built on top of it.
