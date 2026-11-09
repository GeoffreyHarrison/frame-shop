# Frame Shop App — Project Guide

A practical guide to understanding, navigating, and extending this project. Written for someone comfortable with basic frontend and databases but new to Next.js, Prisma, and this particular stack.

---

## 1. What This App Is

A web app for a custom framing shop to manage the lifecycle of framing orders — from order entry, through verification, framing, and fitting, to customer pickup. It also tracks the frames/mats/glass that need to be ordered from vendors.

The app is **fully deployed**: it runs on Vercel, backed by a Neon-hosted PostgreSQL database. Every page reads live data from the database and all interactive buttons save state back to it — there is no longer any localStorage-based persistence.

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
    │   ├── seed.ts            ← Script that loads dummy data into the DB
    │   └── backfill-mats.ts   ← One-off: creates MatToOrder rows from existing orders
    └── src/
        ├── app/               ← PAGES & ROUTES (URL structure lives here)
        │   ├── page.tsx       ← "/" — just redirects to /framing-orders
        │   ├── layout.tsx     ← The shell wrapping every page (top bar + sidebars)
        │   ├── globals.css    ← Global styles, color theme, print styles
        │   ├── actions/
        │   │   ├── order-status.ts  ← Update order status, bin location, etc.
        │   │   ├── customers.ts     ← Create/update customer records
        │   │   ├── frame-orders.ts  ← Frame ordering actions (Order/Ordered/Received/Remove)
        │   │   └── mat-orders.ts    ← Mat List actions (Received/Return/Remove/Order)
        │   ├── framing-orders/
        │   │   ├── page.tsx                    ← /framing-orders (orders by day)
        │   │   └── [date]/
        │   │       ├── page.tsx                ← /framing-orders/2026-05-25 (daily detail)
        │   │       └── [orderId]/page.tsx      ← .../ord-id (single order details)
        │   ├── all-orders/page.tsx             ← /all-orders (11 KPI boxes + filtered table)
        │   ├── binventory/page.tsx             ← /binventory (completed orders awaiting pickup)
        │   ├── daily-summaries/page.tsx        ← /daily-summaries (KPIs + calendar)
        │   ├── customers/
        │   │   ├── page.tsx                    ← /customers (alphabetical directory)
        │   │   └── [id]/
        │   │       ├── page.tsx                ← /customers/abc123 (customer detail + orders)
        │   │       └── edit/page.tsx           ← /customers/abc123/edit
        │   ├── frames-to-order/page.tsx        ← /frames-to-order (the Frame List)
        │   ├── orders-to-verify/page.tsx       ← workflow list pages (all use components/order-lists/)
        │   ├── orders-to-table/page.tsx
        │   ├── frames-to-build/page.tsx
        │   ├── orders-to-fit/page.tsx
        │   ├── must-have-orders/page.tsx
        │   ├── delayed-orders/page.tsx
        │   ├── glass-review/page.tsx           ← /glass-review (the Glass List)
        │   ├── mats-to-order/page.tsx          ← /mats-to-order (the Mat List)
        │   ├── mats-to-order/received/page.tsx ← /mats-to-order/received
        │   ├── order-lists/[vendor]/page.tsx   ← /order-lists/larson-juhl (per-vendor)
        │   └── order-search/page.tsx           ← /order-search (order search results)
        ├── components/        ← REUSABLE UI PIECES
        │   ├── layout/        ← top-bar, left-sidebar, right-sidebar
        │   ├── framing-orders/← tables & dialogs for orders
        │   ├── frames/        ← tables for the frame-ordering flow
        │   ├── all-orders/    ← KPI boxes and table for All Orders page
        │   ├── binventory/    ← table for Binventory page
        │   ├── order-lists/   ← shared list-page pieces: header/print button, status toggle, workflow + mat tables
        │   ├── customers/     ← directory, detail, edit, and new-customer modal
        │   ├── daily-summaries/ ← KPI boxes and tables for Daily Summaries
        │   ├── order-search/  ← results table for Order Search page
        │   └── ui/            ← small shared bits (search-input, etc.)
        ├── lib/               ← LOGIC & HELPERS (no UI)
        │   ├── prisma.ts      ← Creates the database connection (used by db.ts)
        │   ├── db.ts          ← All database queries live here
        │   ├── types.ts       ← TypeScript shapes for Order, Customer, etc.
        │   └── due-date.ts    ← Date formatting helpers
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
| `app/framing-orders/[date]/page.tsx` | `/framing-orders/2026-05-25` |
| `app/framing-orders/[date]/[orderId]/page.tsx` | `/framing-orders/2026-05-25/abc123` |
| `app/all-orders/page.tsx` | `/all-orders` |
| `app/binventory/page.tsx` | `/binventory` |
| `app/daily-summaries/page.tsx` | `/daily-summaries` |
| `app/customers/page.tsx` | `/customers` |
| `app/customers/[id]/page.tsx` | `/customers/abc123` |
| `app/customers/[id]/edit/page.tsx` | `/customers/abc123/edit` |
| `app/frames-to-order/page.tsx` | `/frames-to-order` |
| `app/orders-to-verify/page.tsx` | `/orders-to-verify` (also `orders-to-table`, `frames-to-build`, `orders-to-fit`, `must-have-orders`, `delayed-orders`) |
| `app/glass-review/page.tsx` | `/glass-review` |
| `app/mats-to-order/page.tsx` | `/mats-to-order` |
| `app/mats-to-order/received/page.tsx` | `/mats-to-order/received` |
| `app/order-lists/[vendor]/page.tsx` | `/order-lists/larson-juhl` |
| `app/order-search/page.tsx` | `/order-search?q=smith` |

**Square brackets = a variable part of the URL.** `[date]` means "anything here is captured as a value called `date`." So `/framing-orders/2026-05-25` gives the page `date = "2026-05-25"`. This is how one file serves every day's detail page. Same idea for `[orderId]`, `[vendor]`, and `[id]`.

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

For **reads** (getting data):
```
Page (server)  ──fetches orders──▶  Table (client)  ──renders──▶  screen
```

For **writes** (saving changes), we use **Server Actions** — functions marked `"use server"` that run on the server:
```
Button (client)  ──onclick calls──▶  Server Action  ──updates DB──▶  Page revalidates
```

A Server Action is like a mini API endpoint you write right in your app. No separate backend needed.

> **Rule of thumb:** If a file needs `onClick` / `useState`, it needs `"use client";`. If it needs the database, it must be a server component (no `"use client";`) or a Server Action. They talk to each other through props and function calls.

A subtle gotcha: data passed from a server component to a client component must be plain JSON-friendly values (strings, numbers, arrays, plain objects). That's why `db.ts` converts database `Date` objects into plain date strings before handing them to components.

---

## 6. How Data Flows (from database to screen and back)

### Reading data (queries)
```
PostgreSQL  →  prisma.ts  →  db.ts  →  page.tsx (server)  →  component (client)  →  screen
 (storage)    (connection)  (queries)   (fetches data)        (renders/interacts)
```

1. **`prisma.ts`** opens one shared connection to PostgreSQL.
2. **`db.ts`** holds every query — e.g. `getOrdersForDate("2026-05-25")`. It also *maps* raw DB rows into the clean shapes defined in `types.ts` (converting dates to strings, filling in customer names, etc.).
3. **A page** (`page.tsx`) calls a `db.ts` function with `await`.
4. The page passes the result as props into a **component**.
5. The component renders it.

### Saving data (mutations via Server Actions)
```
Button click (client)  →  Server Action  →  prisma.ts  →  PostgreSQL
                            (update DB)       (connection)  (storage)
                                ↓
                            revalidatePath()  ←  page re-fetches data
```

1. A client component has a button with `onClick={() => updateOrderStatus(...)}`
2. `updateOrderStatus` is a Server Action (marked `"use server";` in `src/app/actions/order-status.ts`)
3. The action calls `prisma.order.update(...)` to save changes
4. The action calls `revalidatePath(...)` to tell Next.js "this data changed, fetch it fresh"
5. The page re-fetches and the component updates automatically

**Want to change what data appears on a page?** Start in `db.ts`. **Want to change how it looks?** Go to the component. **Want to save a button click to the database?** Write a Server Action in `src/app/actions/`.

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

### What's working — all database-backed
- ✅ **All pages read live from PostgreSQL** — no dummy data, no localStorage.
- ✅ **Order Status Tracking** — all 8 status buttons (verified/tabled/built/completed/pickedUp/mustHave/delayed/bin) save timestamps to the database via Server Actions.
- ✅ **Frame Ordering Workflow** — fully database-backed: Order button → To Order list → Ordered button → Received button, including per-vendor right-panel links.
- ✅ **Binventory page** (`/binventory`) — shows completed orders awaiting pickup, with sort options and Picked Up button.
- ✅ **All Orders page** (`/all-orders`) — 11 KPI boxes (Verified, Tabled, Built, etc.) that filter the table when clicked.
- ✅ **Daily Summaries page** (`/daily-summaries`) — 3 KPIs (Orders Taken, Completed, Picked Up) with a calendar date picker.
- ✅ **Customer Directory** (`/customers`) — alphabetical list with search, New Customer modal, detail page, and full edit page.
- ✅ **Order Search** (`/order-search`) — search by order number, first name, last name, or phone; results table with editable Bin field, Verify toggle, and Picked Up button.
- ✅ **Workflow list pages** — Orders to Verify, Orders to Table, Frames to Build, Orders to Fit, Must Have Orders, Delayed Orders. Each uses the same round status buttons and Server Actions as Daily Detail, so a change on any page shows up on all of them; a row leaves the list as soon as it no longer matches.
- ✅ **Mat List + Received Mats** (`/mats-to-order`) — per-mat state in the `MatToOrder` table. Remove is a soft delete.
- ✅ **Glass List** (`/glass-review`) — read-only list of orders needing glass.
- ✅ **Deployed on Vercel + Neon** — live on the internet, auto-deploys on every push to `main`.

### Not yet built (left-sidebar placeholder links)
- **Photo Orders**, **To Scan**, **Ready to Print** — photo-workflow pages
- **Supplies List**, **PC Order** — right-sidebar links

### Recommended next steps
1. **Build the photo-workflow pages** — the list-page pieces in `components/order-lists/` can be reused.
2. **Add authentication** so only shop staff can log in (before sharing the URL publicly).
3. **Finalize the data fields** with the shop — the schema is a first draft and expected to change.

---

## 10. Action Workflows & Order Status Flow

This section describes what happens when buttons are clicked and how orders move through different states in the system.

### Order Status Buttons

Each order can have the following statuses tracked as timestamps on the database:

| Status | What it means | Button location | When to click |
|--------|---------------|-----------------|---------------|
| **Received** (`receivedAt`) | Frame arrived from vendor | Frame List (right column) | When the frame order arrives |
| **Verified** (`verifiedAt`) | Order measurements double-checked | Order Details / Daily Detail | After confirming all specs are correct |
| **Tabled** (`tabledAt`) | Mats cut and mounted | Order Details / Daily Detail | When mat work is complete |
| **Built** (`builtAt`) | Frame assembled and glass installed | Order Details / Daily Detail | When frame is fully assembled |
| **Completed** (`completedAt`) | Order ready for pickup | Order Details / Daily Detail | After final quality check, before pickup |
| **Picked Up** (`pickedUpAt`) | Customer took the order | Order Details / Binventory | When customer comes to collect |
| **Must Have** (`mustHaveStatus`) | Urgent/priority order | Order Details / Daily Detail | If marked as high-priority by customer |
| **Delayed** (`delayedStatus`) | Order has delays | Order Details / Daily Detail | If issues arise |

**How they work:**
- Click a button to set the status (timestamp set to "now").
- Click it again to clear the status (timestamp set to null).
- Status is saved to PostgreSQL immediately via a Server Action.
- All other devices see the change within seconds (page revalidates).
- The **Progress** section on Order Details shows a timeline of when each milestone was reached.

### Order Flow Lifecycle

```
Customer places order
        ↓
[Framing Orders] page shows order in "by due date" table
        ↓
Click eye icon → [Daily Detail] page
        ↓
Click [Verified] → confirms measurements
        ↓
Click [Tabled] → mats are ready
        ↓
Click [Built] → frame is assembled
        ↓
Click [Completed] → ready for pickup
        ↓
[Binventory] shows completed orders waiting for pickup
        ↓
Click [Picked Up] → order removed from bins
```

### Frame Ordering Workflow

All steps are fully database-backed. The `FrameToOrder` table tracks each frame through its lifecycle using a `status` field.

| Step | Page | What happens | DB change |
|------|------|--------------|-----------|
| 1 | **Frame List** (`/frames-to-order`) | Staff see frames with `status = "On List"`, grouped by vendor | — |
| 2 | **Frame List** | Click **Order** → frame moves to vendor's To Order list | `status → "Ordered"` |
| 3 | **To Order list** (`/order-lists/[vendor]`) | Staff see frames with `status = "Ordered"` for that vendor; link appears in right panel | — |
| 4 | **To Order list** | Click **Ordered** → toggles the ordered date (confirms it was sent) | `orderedDate` set/cleared |
| 5 | **To Order list** | Click **Remove** → pulls frame off the list without receiving | `status → "Removed"` |
| 6 | **To Order list** | Click **Received** → frame arrives from vendor, disappears from list | `status → "Received"`, `receivedDate` set |
| 7 | **Frames to Build** (`/frames-to-build`) | Staff see orders where frame is received + order is verified + not built; the Frame Built button clears it | `builtAt` set |

---

## 11. Making Common Changes (recipes)

**Change the text or layout of a page:** edit the matching `page.tsx` in `src/app/`, or the component it renders in `src/components/`.

**Change a color or spacing:** the design uses Tailwind utility classes inline (e.g. `text-primary-dark`, `rounded-lg`). The custom color names (`primary`, `primary-dark`, `panel`, `accent-yellow`, etc.) are defined in `src/app/globals.css`. Change them there to retheme globally.

**Add a new page/URL:** create a new folder under `src/app/` with a `page.tsx` inside it. Add a link to it in `left-sidebar.tsx` or `right-sidebar.tsx`.

**Show different/more data on a page:** add or edit a query function in `src/lib/db.ts`, then call it from the page.

**Add a field to orders/customers:** follow the schema-change workflow in Section 7, then surface the field in `db.ts` and the relevant component.

**Add an icon:** import it from `lucide-react` (browse names at lucide.dev) and drop it in like `<Calendar size={18} />`.

**Save a button click to the database:** This is the Server Action pattern. Example: add a "Flag as important" button that sets a boolean in the database.

1. **Create a Server Action** in `src/app/actions/some-action.ts`:
   ```tsx
   "use server"
   
   import { prisma } from "@/lib/prisma"
   import { revalidatePath } from "next/cache"
   
   export async function flagOrderAsImportant(orderId: string) {
     await prisma.order.update({
       where: { id: orderId },
       data: { flagged: true },
     })
     revalidatePath("/framing-orders")  // refresh the page
   }
   ```

2. **Import and call it from a client component:**
   ```tsx
   "use client"
   
   import { flagOrderAsImportant } from "@/app/actions/some-action"
   
   export function OrderRow({ order }) {
     return (
       <button onClick={() => flagOrderAsImportant(order.id)}>
         Flag
       </button>
     )
   }
   ```

3. **Show the value in your component or page** by reading it from the database (as you already do with other fields).

That's it — button clicks → Server Action → database update → page refresh → UI shows new state. No separate API needed.

---

## 12. Deploying & Hosting on Vercel

The app is **already live** on Vercel, connected to a Neon-hosted PostgreSQL database. This section documents how the setup works and what to do when you make changes.

### Current setup
- **GitHub repo:** `github.com/GeoffreyHarrison/frame-shop`
- **Vercel project:** Root Directory is set to `frontend` (the Next.js app is in the subfolder)
- **Database:** Neon (neon.tech) — find the connection string in the Neon dashboard under Connection Details
- **Environment variable in Vercel:** `DATABASE_URL` = your Neon connection string

### Deploying code changes
Every `git push` to `main` auto-deploys. Vercel rebuilds the app and ships it within a couple of minutes. No manual steps needed for code-only changes.

```bash
git add <files>
git commit -m "your message"
git push origin main
```

### Applying database schema changes
When you add or change something in `prisma/schema.prisma`:

**1. Create the migration locally (on your dev machine):**
```bash
cd frontend
npx prisma migrate dev --name describe_your_change
```
This updates your local database and creates a new file in `prisma/migrations/`.

**2. Push your code (including the new migration file) to GitHub** — Vercel will deploy the new app code.

**3. Apply the migration to the production (Neon) database:**
```bash
cd frontend
DATABASE_URL="your-neon-connection-string" npx prisma migrate deploy
```
`migrate deploy` only applies migrations that haven't run yet — it's safe to run repeatedly and won't touch your data. Get the connection string from the Neon dashboard.

> **Important:** Vercel deploys new code automatically, but it does NOT run migrations automatically. You must run step 3 manually any time the schema changes.

### Gotchas to remember
- Vercel Root Directory **must** be `frontend` — don't change this.
- `DATABASE_URL` must stay set in Vercel's Environment Variables (it doesn't read your local `.env`).
- The `postinstall: prisma generate` script in `package.json` is required — it regenerates the Prisma client on every Vercel build (since the generated client isn't committed to git).

---

## 13. Quick Reference — "Where do I go to…?"

| I want to… | Go to… |
|------------|--------|
| Change what a page shows | `src/app/.../page.tsx` |
| Change how something looks | the component in `src/components/` |
| Change colors/theme | `src/app/globals.css` |
| Change/add a database query | `src/lib/db.ts` |
| Change the database structure | `prisma/schema.prisma` (then migrate — see Section 7 & 12) |
| Add a new URL/page | new folder + `page.tsx` in `src/app/` |
| Save a button click to the database | write a Server Action in `src/app/actions/` |
| Reload test data | `npm run db:seed` |
| Inspect the database visually | `npm run db:studio` |
| Understand a data shape | `src/lib/types.ts` |
| Apply schema changes to production | `DATABASE_URL="..." npx prisma migrate deploy` |
| See all built pages | Section 9 of this guide |
```
