# Frame Shop App — Project Guide

A practical guide to understanding, navigating, and extending this project. Written for someone comfortable with basic frontend and databases but new to Next.js, Prisma, and this particular stack.

---

## 1. What This App Is

A web app for a custom framing shop to manage the lifecycle of framing orders — from order entry, through verification, framing, and fitting, to customer pickup. It also tracks the frames/mats/glass that need to be ordered from vendors.

Right now the app is **frontend-heavy with a real database behind it**. The pages read live data from PostgreSQL. Some interactive buttons still save their state in the browser (more on that in Section 9).

---

## 2. The Tech Stack (and what each piece does)

| Layer | Technology | What it does for us |
|-------|-----------|---------------------|
| Framework | **Next.js 16** (App Router) | Runs both the frontend (React pages) AND the backend (server code that talks to the database) in one project |
| UI library | **React 19** | Builds the interface out of reusable components |
| Styling | **Tailwind CSS v4** | Styling via utility class names directly in the markup (e.g. `className="p-4 rounded-lg"`) |
| Icons | **lucide-react** | The icon set (calendar, check, star, etc.) |
| Database | **PostgreSQL 16** | Stores customers, orders, comments, frames-to-order |
| Database toolkit | **Prisma 7** | Translates between TypeScript code and SQL. You write `prisma.order.findMany()` instead of raw SQL |
| Language | **TypeScript** | JavaScript with types — catches typos and shape mismatches before the app runs |

**Mental model:** Think of Next.js as both your Express server *and* your React frontend in one codebase. Some code runs on the server (where it can safely touch the database), and some runs in the user's browser (where it handles clicks and interactivity). The trick to understanding Next.js is knowing which is which — see Section 5.

---

## 3. Where Everything Lives

The repo root is `/Users/geoffreyharrison/Apps/frame-shop`. The actual app lives inside `frontend/`.

```
frame-shop/
├── .claude/CLAUDE.md          ← Project notes & UI change requests (read by Claude)
├── context/                   ← UI mockups & planning docs from the shop
├── PROJECT_GUIDE.md           ← This file
└── frontend/                  ← THE APP (you'll spend ~all your time here)
    ├── .env                   ← Database connection string (NOT committed to git)
    ├── package.json           ← Dependencies + run commands (npm scripts)
    ├── prisma.config.ts       ← Prisma settings (DB URL, seed command)
    ├── prisma/
    │   ├── schema.prisma      ← THE DATABASE SHAPE — defines all tables
    │   ├── migrations/        ← Auto-generated SQL history of schema changes
    │   └── seed.ts            ← Script that loads dummy data into the DB
    └── src/
        ├── app/               ← PAGES & ROUTES (URL structure lives here)
        │   ├── page.tsx       ← "/" — just redirects to /framing-orders
        │   ├── layout.tsx     ← The shell wrapping every page (top bar + sidebars)
        │   ├── globals.css    ← Global styles, color theme, print styles
        │   ├── framing-orders/
        │   │   ├── page.tsx                    ← /framing-orders (orders by day)
        │   │   └── [date]/
        │   │       ├── page.tsx                ← /framing-orders/2026-05-25 (daily detail)
        │   │       └── [orderId]/page.tsx      ← .../ord-id (single order details)
        │   ├── frames-to-order/page.tsx        ← /frames-to-order (the Frame List)
        │   └── order-lists/[vendor]/page.tsx   ← /order-lists/larson-juhl (per-vendor)
        ├── components/        ← REUSABLE UI PIECES
        │   ├── layout/        ← top-bar, left-sidebar, right-sidebar
        │   ├── framing-orders/← tables & dialogs for orders
        │   ├── frames/        ← tables for the frame-ordering flow
        │   └── ui/            ← small shared bits (search-input)
        ├── lib/               ← LOGIC & HELPERS (no UI)
        │   ├── prisma.ts      ← Creates the database connection (used by db.ts)
        │   ├── db.ts          ← All database queries live here
        │   ├── types.ts       ← TypeScript shapes for Order, Customer, etc.
        │   ├── due-date.ts    ← Date formatting helpers
        │   ├── order-statuses.ts ← Browser-storage logic for status buttons
        │   └── vendor-orders.ts  ← Browser-storage logic for the Order button
        ├── data/              ← Original dummy JSON (now only used to seed the DB)
        └── generated/prisma/  ← Auto-generated Prisma code (don't edit; not in git)
```

**The three folders that matter most:**
- `src/app/` — add or change a URL/page here
- `src/components/` — change how something looks or behaves
- `src/lib/db.ts` — change what data is fetched

---

## 4. How the URLs Work (App Router routing)

In Next.js App Router, **folders inside `src/app/` become URLs**. A file named `page.tsx` is the page shown at that URL.

| Folder path | URL |
|-------------|-----|
| `app/framing-orders/page.tsx` | `/framing-orders` |
| `app/frames-to-order/page.tsx` | `/frames-to-order` |
| `app/framing-orders/[date]/page.tsx` | `/framing-orders/2026-05-25` |

**Square brackets = a variable part of the URL.** `[date]` means "anything here is captured as a value called `date`." So `/framing-orders/2026-05-25` gives the page `date = "2026-05-25"`. This is how one file serves every day's detail page. Same idea for `[orderId]` and `[vendor]`.

`layout.tsx` is special: it wraps *every* page with the shared shell (top bar, left sidebar, right sidebar). The page content gets dropped into the `{children}` slot. That's why you don't repeat the sidebars on every page.

---

## 5. The Most Important Concept: Server vs. Client Components

This is the one Next.js idea that trips up newcomers. Every component is **one of two kinds**:

### Server Components (the default)
- Run **on the server**, before the page is sent to the browser.
- **Can talk to the database directly** (this is why our pages can call `db.ts`).
- Cannot use interactivity like `onClick`, `useState`, or `useEffect`.
- You can tell because they're often `async function` and have no `"use client"` at the top.

Example — `src/app/framing-orders/page.tsx`:
```tsx
import { getOrdersByDay } from "@/lib/db";

export default async function FramingOrdersPage() {
  const ordersByDay = await getOrdersByDay();   // ← talks to the DB, on the server
  return <OrdersByDayTable ordersByDay={ordersByDay} />;
}
```

### Client Components
- Run **in the browser**.
- **Can** handle clicks, form input, and local state (`useState`, `useEffect`).
- **Cannot** talk to the database directly.
- Marked with `"use client";` as the very first line of the file.

Example — `src/components/framing-orders/daily-detail-table.tsx` starts with `"use client";` because it has clickable status buttons.

### The pattern we use everywhere
**Server component fetches data → passes it down as props → client component handles interaction.**

```
Page (server)  ──fetches orders──▶  Table (client)  ──handles clicks──▶ browser storage
```

> **Rule of thumb:** If a file needs `onClick` / `useState`, it needs `"use client";`. If it needs the database, it must be a server component (no `"use client";`). They talk to each other through props.

A subtle gotcha: data passed from a server component to a client component must be plain JSON-friendly values (strings, numbers, arrays, plain objects). That's why `db.ts` converts database `Date` objects into plain date strings before handing them to components.

---

## 6. How Data Flows (from database to screen)

```
PostgreSQL  →  prisma.ts  →  db.ts  →  page.tsx (server)  →  component (client)  →  screen
 (storage)    (connection)  (queries)   (fetches data)        (renders/interacts)
```

1. **`prisma.ts`** opens one shared connection to PostgreSQL.
2. **`db.ts`** holds every query — e.g. `getOrdersForDate("2026-05-25")`. It also *maps* raw DB rows into the clean shapes defined in `types.ts` (converting dates to strings, filling in customer names, etc.).
3. **A page** (`page.tsx`) calls a `db.ts` function with `await`.
4. The page passes the result as props into a **component**.
5. The component renders it.

**Want to change what data appears on a page?** Start in `db.ts`. **Want to change how it looks?** Go to the component.

---

## 7. The Database (Prisma) Workflow

The shape of the database is defined in **`prisma/schema.prisma`**. We have four tables (Prisma calls them "models"): `Customer`, `Order`, `Comment`, and `FrameToOrder`. They're linked by relations (e.g. an `Order` belongs to a `Customer` and has many `Comment`s).

### The golden rule of schema changes
Whenever you edit `schema.prisma`, you must run two commands so the code and database stay in sync:

```bash
cd frontend
npx prisma migrate dev --name describe_your_change   # updates the DB + records the change
npx prisma generate                                  # updates the TypeScript code
```

`migrate dev` figures out the SQL needed, applies it to your local database, and saves it as a file in `prisma/migrations/`. `generate` regenerates the typed Prisma client so your editor knows about the new fields.

### Example: adding a "rush fee" field to orders
1. In `schema.prisma`, inside `model Order { ... }`, add:
   ```prisma
   rushFee  Float  @default(0)
   ```
2. Run `npx prisma migrate dev --name add_rush_fee`
3. Run `npx prisma generate`
4. The field is now usable in `db.ts` queries and shows up in autocomplete.

### Reseeding / resetting
- **Reload dummy data:** `npm run db:seed`
- **Wipe and rebuild the DB from scratch (also reseeds):** `npm run db:reset`
- **Browse the data in a visual editor:** `npm run db:studio` (opens Prisma Studio in your browser — great for inspecting/editing rows by hand)

### A note on this Prisma version
We're on Prisma 7 (early access), which works a little differently from older tutorials you might find online:
- The database URL lives in `prisma.config.ts` and `.env`, **not** inside `schema.prisma`.
- It connects through a "driver adapter" (`@prisma/adapter-pg`) — that's the `new PrismaPg(...)` line in `prisma.ts`.
- The generated client lands in `src/generated/prisma/` (most projects put it in `node_modules`).

If you follow an online Prisma tutorial and something about setup doesn't match, this is usually why.

---

## 8. Running the Project Locally

**One-time setup** (already done on this machine): PostgreSQL is installed via Homebrew and a database named `frameshop` exists.

**Every time you sit down to work:**

```bash
# 1. Make sure PostgreSQL is running (it auto-starts on login, but to be sure):
brew services start postgresql@16

# 2. Go into the app and start the dev server:
cd frontend
npm run dev
```

Then open **http://localhost:3000** — the app auto-redirects to `/framing-orders`. Edits to files appear in the browser within a second or two (no manual refresh needed).

**The npm scripts** (run with `npm run <name>` inside `frontend/`):

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start the local dev server (use this daily) |
| `npm run build` | Compile a production build; also catches TypeScript errors |
| `npm run start` | Run the production build locally (after `build`) |
| `npm run lint` | Check code for style/quality issues |
| `npm run db:seed` | Load dummy data into the database |
| `npm run db:reset` | Wipe DB, re-run migrations, reseed |
| `npm run db:studio` | Open Prisma Studio to browse data |

> **Tip:** Run `npm run build` before you consider a change "done." It type-checks the whole project and will catch mistakes the dev server sometimes lets slide.

---

## 9. Current State & What's Left

### What's working
- All pages read live from PostgreSQL.
- Customers, orders, comments, and frames-to-order are seeded and queryable.
- Navigation, layout, styling, and the order/frame views are built out.

### The one big thing still to migrate: writes
Reading from the database is done. **Saving changes** is not — a few interactive features still store their state in the **browser's localStorage** instead of the database. This means those changes live only in *that one browser* and vanish if you clear browser data. They are:

1. **Status buttons** (verified / tabled / built / completed / must-have / delayed) on the Daily Detail and Order Details pages — logic in `src/lib/order-statuses.ts`.
2. **The "Order" button** on the Frame List, which drives the per-vendor order lists — logic in `src/lib/vendor-orders.ts`.
3. **The due-date override** in the top bar — logic inside `src/components/layout/top-bar.tsx`.

### Recommended next steps (roughly in order)
1. **Migrate writes to the database using Server Actions.** A Server Action is a Next.js feature that lets a button in a client component safely run code on the server (to update the DB) without you building a separate API. This would replace the localStorage logic in items 1 and 2 above so changes persist for everyone.
2. **Build the Customer Directory and Vendor screens** (the top-bar buttons are placeholders today).
3. **Add the remaining left-sidebar pages** (Orders to Verify, Orders to Table, etc.) — many can reuse the existing order-table components with different filters in `db.ts`.
4. **Add authentication** so only shop staff can log in (before going live).
5. **Sit down with the shop** to finalize the data fields (the schema is a first draft and expected to change).

When you tackle item 1, the pattern is: write a function in a `actions.ts` file marked `"use server";`, call it from the button's `onClick`, and have it call `prisma.order.update(...)`. That's the natural follow-on to the read layer already in `db.ts`.

---

## 10. Making Common Changes (recipes)

**Change the text or layout of a page:** edit the matching `page.tsx` in `src/app/`, or the component it renders in `src/components/`.

**Change a color or spacing:** the design uses Tailwind utility classes inline (e.g. `text-primary-dark`, `rounded-lg`). The custom color names (`primary`, `primary-dark`, `panel`, `accent-yellow`, etc.) are defined in `src/app/globals.css`. Change them there to retheme globally.

**Add a new page/URL:** create a new folder under `src/app/` with a `page.tsx` inside it. Add a link to it in `left-sidebar.tsx` or `right-sidebar.tsx`.

**Show different/more data on a page:** add or edit a query function in `src/lib/db.ts`, then call it from the page.

**Add a field to orders/customers:** follow the schema-change workflow in Section 7, then surface the field in `db.ts` and the relevant component.

**Add an icon:** import it from `lucide-react` (browse names at lucide.dev) and drop it in like `<Calendar size={18} />`.

---

## 11. Deploying & Hosting on Vercel

Vercel is the company that makes Next.js, so deployment is about as smooth as it gets. The catch for us: **Vercel hosts the app, but not the database.** PostgreSQL needs to live somewhere too. The plan below covers both.

### Step 1 — Put the code on GitHub
Vercel deploys from a Git repository. If the project isn't on GitHub yet:
1. Create a new (private) repository on github.com.
2. From the repo root, push the code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/frame-shop.git
   git push -u origin main
   ```
`.env` is gitignored, so your local database password won't be uploaded — you'll set the production one in Vercel directly (Step 3).

### Step 2 — Create a production database
Your local PostgreSQL won't be reachable from the internet, so you need a hosted one. Easiest options (all have free tiers):
- **Vercel Postgres** — built into the Vercel dashboard, simplest integration.
- **Neon** (neon.tech) — generous free tier, Postgres-native.
- **Supabase** (supabase.com) — Postgres plus extras.

Whichever you pick, you'll get a **connection string** that looks like:
```
postgresql://user:password@host.region.provider.com:5432/dbname
```
Copy it — that's your production `DATABASE_URL`.

### Step 3 — Import the project into Vercel
1. Go to vercel.com and sign up / log in (you can use your GitHub account).
2. Click **Add New → Project**, then import your `frame-shop` repo.
3. **Important — set the Root Directory to `frontend`.** Our Next.js app lives in the `frontend/` subfolder, not the repo root. Vercel needs to know this or the build will fail.
4. Under **Environment Variables**, add:
   - Name: `DATABASE_URL`
   - Value: the production connection string from Step 2
5. Click **Deploy**.

Vercel auto-detects Next.js and runs the build for you. First deploy takes a couple of minutes.

### Step 4 — Set up the production database tables
The hosted database starts empty — it has no tables yet. Apply your schema to it. From your machine, temporarily point at production and run the migration:

```bash
cd frontend
DATABASE_URL="your-production-connection-string" npx prisma migrate deploy
```

`migrate deploy` applies your existing migrations to the production database (it's the production-safe version of `migrate dev`). To also load the dummy data:

```bash
DATABASE_URL="your-production-connection-string" npx prisma db seed
```

(Once real data exists, you'd skip the seed step.)

### Step 5 — Confirm the build command handles Prisma
Because our Prisma client is generated into `src/generated/` (which isn't committed to git), Vercel must regenerate it during the build. Add a `postinstall` script so this happens automatically. In `frontend/package.json` scripts, add:
```json
"postinstall": "prisma generate"
```
This runs `prisma generate` every time Vercel installs dependencies, ensuring the typed client exists before the build. (Do this before your first successful deploy — if the first build fails with a Prisma client error, this is the fix.)

### After it's live
- **Every `git push` to `main` auto-deploys.** Vercel rebuilds and ships the new version in a couple minutes.
- **Pull requests get preview URLs** automatically — a temporary live copy of your branch to review before merging.
- You get a free `your-project.vercel.app` URL; you can attach a custom domain later in the Vercel dashboard.

### Deployment gotchas to remember
- Root Directory **must** be `frontend`.
- `DATABASE_URL` must be set in Vercel's environment variables (production won't see your local `.env`).
- Run `prisma migrate deploy` against production whenever you change the schema — Vercel does not do this for you.
- The `postinstall: prisma generate` script is required because the generated client isn't in git.

---

## 12. Quick Reference — "Where do I go to…?"

| I want to… | Go to… |
|------------|--------|
| Change what a page shows | `src/app/.../page.tsx` |
| Change how something looks | the component in `src/components/` |
| Change colors/theme | `src/app/globals.css` |
| Change/add a database query | `src/lib/db.ts` |
| Change the database structure | `prisma/schema.prisma` (then migrate) |
| Add a new URL/page | new folder + `page.tsx` in `src/app/` |
| Reload test data | `npm run db:seed` |
| Inspect the database visually | `npm run db:studio` |
| Understand a data shape | `src/lib/types.ts` |
```
