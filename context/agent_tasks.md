# Agent Tasks — Workflow List Pages, Mat List, Glass List

This is the implementation plan for the 8 tasks in `context/tasks.md`. It is written for a coding agent. Read the whole document before starting, and **check the Open Questions section at the bottom first**: the owner's answers override anything in this plan.

---

## 0. Before You Start

### Required reading
1. `frontend/AGENTS.md`: this is **Next.js 16**. Its APIs differ from older versions. Read the relevant guides in `frontend/node_modules/next/dist/docs/` before writing route or cache code (especially `revalidatePath`, `params` as a Promise, and Server Actions).
2. `PROJECT_GUIDE.md`, sections 5–7, 10 and 12: server and client component pattern, data flow, Prisma workflow, status buttons, deploying.
3. `context/data_guide.md`: the schema reference. Use the **timestamp** status fields (`verifiedAt`, `tabledAt`, `builtAt`, `completedAt`, `pickedUpAt`, `mustHaveStatus`, `delayedStatus`). **Never** use the legacy booleans (`verified`, `tabled`, `must`, `delayed`, etc.).

### Reference implementation to copy
Every list page in this plan should look and behave like the vendor To Order page:
- Page: `frontend/src/app/order-lists/[vendor]/page.tsx`
- Table: `frontend/src/components/frames/order-list-table.tsx`

From it, reuse these:
- An `h1` heading: `text-2xl font-bold text-primary-dark font-serif`, `mb-6`.
- A download button: a round `bg-primary-dark` button with the lucide `Download` icon, right-aligned above the table. It calls `window.print()`. The inline `@media print` style block and the `no-print` class hide buttons when printing.
- A table wrapper: `rounded-xl overflow-hidden border border-primary-dark/15`.
- A header row: `bg-primary-dark`, white `text-sm font-semibold` headers.
- Banded rows: `idx % 2 === 0 ? "bg-white" : "bg-light-grey"`, `border-b border-primary-dark/10`.
- An empty state: centered `text-primary/60` message.
- Qty is shown as `(x{n})`. Order # uses `font-mono`.
- A `loadingId` pattern that disables a row's buttons while its Server Action runs.
- `export const dynamic = 'force-dynamic'` on every page.

Status toggle logic to copy is in `frontend/src/components/framing-orders/daily-detail-table.tsx`, lines ~30–65: check the timestamp, then call `clearOrderStatus` or `updateOrderStatus`. Status icon styling (star, !, check, T, rectangle, smiley) is in `frontend/src/components/framing-orders/status-icon-button.tsx`.

### Known existing issues to fix in Phase 0
- `frontend/prisma/seed.ts` still writes `receivedAt` on Order. That column was removed from the schema, so seeding will fail. Remove it.
- The seed never sets `FrameToOrder.receivedDate` or `status: "Received"`. Without that, **Frames to Build** and **Orders to Fit** will always be empty in dev.
- `getOrdersReadyForFrameBuild()` lives in `app/actions/order-status.ts`, which is a `'use server'` file, so it is exposed as a callable action. It returns raw Prisma rows. Move it to `lib/db.ts` and have it return mapped `Order[]`.
- `updateOrderStatus` and `clearOrderStatus` only revalidate `/framing-orders...` paths. The new pages must refresh after a click (see 0.2).

---

## Phase 0: Shared Infrastructure (do this first, one commit)

### 0.1 Shared list-page building blocks
Create `frontend/src/components/order-lists/` containing:

- **`list-page-header.tsx`**: a heading on the left, and slots on the right for extra buttons (the Mat List needs "Received Mats") plus the download/print button. Move the print-style block in here so it isn't duplicated.
- **`order-list-shell.tsx`** (optional): the rounded table wrapper, `thead` styling, banded `tbody`, and empty state. Columns are passed as config (`{ header, align, render, printable }`), similar to `components/all-orders/all-orders-table.tsx`. Use this if it keeps the six order pages short. Don't over-abstract: plain JSX tables per page are fine.
- **`status-toggle-cell.tsx`** (client): wraps the existing round `StatusIconButton` for one order and one status. Per **Q1**, use the round icon buttons for every status on every list page, not text pills. It takes `order`, `status`, `active`, and calls the Server Action. This is the "works with the other buttons in the app" guarantee. Every list writes the **same DB column** through the **same action**, so a state change anywhere shows up everywhere.

### 0.2 Revalidation
In `frontend/src/app/actions/order-status.ts`, make `updateOrderStatus` and `clearOrderStatus` (and `updateBinLocation`) call `revalidatePath('/', 'layout')`. This refreshes every page, and it is the same approach `frame-orders.ts` already uses. Do the same in `frame-orders.ts` for any action that affects Frames to Build: `markFrameReceived` and `setFrameOrderedDate`/`clearFrameOrderedDate`, which already partially do it.

### 0.3 Row fall-off behaviour
After a successful toggle, the row should disappear immediately because the page re-fetches and the query no longer matches. Rows should not linger, and there is no Undo message (**Q2**: option a). Disable the row's buttons while the action is in flight.

### 0.4 Query helpers in `frontend/src/lib/db.ts`
Add one function per list. All of them include `{ customer: true, comments: true, frameToOrder: true }`, return `rows.map(mapOrder)`, and sort by `orderBy: [{ dueDate: 'asc' }, { orderNumber: 'asc' }]`. Use order number as the tiebreaker so the order is stable.

| Function | `where` |
|---|---|
| `getOrdersToVerify()` | `verifiedAt: null, pickedUpAt: null` |
| `getOrdersToTable()` | `verifiedAt: {not: null}, tabledAt: null, pickedUpAt: null` |
| `getFramesToBuild()` | `verifiedAt: {not: null}, builtAt: null, pickedUpAt: null, frameToOrder: { receivedDate: {not: null} }` (replaces `getOrdersReadyForFrameBuild`) |
| `getOrdersToFit()` | `verifiedAt: {not: null}, tabledAt: {not: null}, builtAt: {not: null}, completedAt: null, pickedUpAt: null` |
| `getMustHaveOrders()` | `mustHaveStatus: {not: null}, pickedUpAt: null` |
| `getDelayedOrders()` | `delayedStatus: {not: null}, pickedUpAt: null` |

The owner confirmed the `pickedUpAt: null` filter on all lists and the `completedAt: null` filter on Orders to Fit (**Q3**). There is no filter on order Type (**Q6**).

### 0.5 Seed fixes
- Remove `receivedAt` from `seed.ts`.
- Mark about 4 of the seeded `FrameToOrder` records as `status: "Received"` with `orderedDate` and `receivedDate` set, on orders that are also verified. Frames to Build then has data, and some of those (also tabled and built) land on Orders to Fit.
- Run `npm run db:reset` **locally only**. **Never** run reset or seed against the Neon production database.

### 0.6 Date display
Show dates as `m/d/yyyy` to match the rest of the app. Use the existing helpers in `frontend/src/lib/due-date.ts`; add one there if none fits. Dates arrive from `mapOrder` as `YYYY-MM-DD` strings. Format them without `new Date(str)` local-time shifting, which would show the previous day.

---

## Task 1: Orders to Verify (`/orders-to-verify`)

**Files:** `src/app/orders-to-verify/page.tsx`, `src/components/order-lists/orders-to-verify-table.tsx`

**Heading:** "Orders to Verify"

**Columns:** Order # · Qty `(x{itemCount})` · Customer Name (`customerName`, which is First Last) · Due Date · **Verify**

**Query:** `getOrdersToVerify()`

**Behaviour:**
- The Verify button toggles `verified` via `updateOrderStatus` or `clearOrderStatus`. Every row is unverified, so clicking verifies the order and the row falls off.
- An order that gets unverified elsewhere (Order Details, Daily Detail, Order Search) reappears in due-date position automatically, because the page reads live data.
- New orders have `verifiedAt = null` by default, so they appear here automatically. No extra work is needed. When an order-entry form is built later, it must not set `verifiedAt`.

**Acceptance:**
- Verifying here removes the row.
- Verifying on Order Details also removes the row after navigating back.
- Unverifying on Order Details brings the row back, correctly sorted.
- Print hides the Verify column.

## Task 2: Orders to Table (`/orders-to-table`)

**Heading:** "Orders to Table"

**Columns:** Order # · Qty · Customer Name · Due Date · Mounting (`mounting`) · Description (`description`) · **Table**

**Query:** `getOrdersToTable()`, which returns orders that are verified and not tabled.

**Behaviour:** the Table button toggles `tabled`, and the row falls off. Unverifying an order elsewhere also removes it from this list. That is expected.

**Acceptance:** same pattern as Task 1. Also, verifying an order on Orders to Verify makes it appear here.

## Task 3: Frames to Build (`/frames-to-build`)

**Heading:** "Frames to Build"

**Columns:** Order # · Qty (`itemCount`, per **Q5**) · Due Date · Frame Ordered Date (`frameOrderedDate`) · Frame Received Date (`frameReceivedDate`) · Frame SKU (`frameSku`) · Frame Description (`frameNotes`) · Frame Size (`frameSize`) · Footage (`footage`) · **Frame Built**

**Query:** `getFramesToBuild()`, which returns orders that are verified, have `frameToOrder.receivedDate` set, and are not built.

**Behaviour:**
- The Frame Built button toggles `built`, and the row falls off.
- Show `—` when the ordered date is empty. That can happen if Received was clicked from the Frame List without the order ever being marked Ordered.
- Delete the old `getOrdersReadyForFrameBuild` from `order-status.ts` once nothing imports it. Grep first.

**Note:** an order with **no** `FrameToOrder` record (for example, a frame in stock or customer-supplied) can never appear here. The owner confirmed this is intended for now (**Q4**).

**Acceptance:**
- Clicking Received on the Frame List, for a verified order, makes it appear here.
- Built here removes it.
- Un-building on Order Details brings it back.

## Task 4: Orders to Fit (`/orders-to-fit`)

**Heading:** "Orders to Fit"

**Columns:** Order # · Qty · Customer Name · Due Date · Description · **Completed**

**Query:** `getOrdersToFit()`, which returns orders that are verified, tabled, built, and not completed.

**Behaviour:** the Completed button toggles `completed`, and the row falls off. The order then appears on **Binventory**, which already exists. Check that Binventory refreshes; the layout-level revalidation in 0.2 covers it.

## Task 5: Must Have Orders (`/must-have-orders`)

**Heading:** "Must Have Orders"

**Columns:** Order # · Qty · Customer Name · Due Date · Description · **Must Have** · **Delayed**

**Query:** `getMustHaveOrders()`, which returns orders with `mustHaveStatus` set that are not picked up.

**Behaviour:**
- **Must Have:** render with `StatusIconButton type="must"`, the yellow star circle, so it matches every other location. Every row shows it active. Clicking it calls `clearOrderStatus(id, 'mustHave')`, and the row falls off.
- **Delayed:** `StatusIconButton type="delayed"`, the red ! circle. It toggles `delayed`. It **does not** affect whether the row is on this list.
- Note the naming mismatch. The UI uses `must`/`delayed`, while the action uses `mustHave`/`delayed`. Map it the way `daily-detail-table.tsx` does.

## Task 6: Delayed Orders (`/delayed-orders`)

**Heading:** "Delayed Orders"

**Columns:** Order # · Qty · Customer Name · Due Date · Description · **Delayed** · **Must Have**. This column order is the reverse of Task 5.

**Query:** `getDelayedOrders()`

**Behaviour:** this mirrors Task 5. Delayed shows active, and clearing it removes the row. Must Have toggles freely without removing the row.

**Shared code:** Tasks 5 and 6 can be one component with a `primary: 'must' | 'delayed'` prop.

---

## Task 7: Mat List (`/mats-to-order`) and Received Mats (`/mats-to-order/received`)

The right sidebar already links "Mat List" to `/mats-to-order`. Keep that route.

### 7.1 Data model (new table; approved in **Q8**)
Mat state is per mat, not per order. One order can have one Mat List row received while another isn't. That state needs storage. Add a table that mirrors `FrameToOrder`:

```prisma
model MatToOrder {
  id           String    @id @default(cuid())
  orderId      String
  order        Order     @relation(fields: [orderId], references: [id])
  position     String    // "Top" | "Second" | "Third"
  matSku       String    // snapshot of Order.topMat / secondMat / thirdMat
  status       String    @default("On List") // "On List" | "Received" | "Removed"
  orderedDate  DateTime? // the "Order" button toggle, saved to the DB (Q9)
  receivedDate DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@unique([orderId, position])
}
```

Also add `matsToOrder MatToOrder[]` to `Order`.

Steps:
1. Edit `schema.prisma`.
2. Run `npx prisma migrate dev --name add_mat_to_order`, then `npx prisma generate`.
3. **Seed:** for each order, create a row for each non-empty `topMat`, `secondMat` and `thirdMat`. In the current dummy data that is about 30 rows: 16 top, 12 second, 2 third.
4. **Backfill for production:** write a one-off script, for example `prisma/backfill-mats.ts`, that creates missing rows from existing orders using `upsert` on `[orderId, position]`. **Do not run it against Neon yourself.** The migration itself also has to be applied to Neon with `prisma migrate deploy`, as described in PROJECT_GUIDE.md section 12. The owner will do both steps with help. When you finish Task 7, write the exact commands and their order (migrate deploy, push code, run backfill) in your final summary.
5. Add `MatToOrder` to `lib/types.ts`, add a `mapMatToOrder` to `db.ts`, and update `context/data_guide.md` and `PROJECT_GUIDE.md`.

There is no order-entry or edit form yet. Add a code comment and a note in `data_guide.md`: **when order create or edit is built, it must create, update or delete `MatToOrder` rows** to match the mat fields.

### 7.2 Server Actions in `src/app/actions/mat-orders.ts` (new)
- `markMatReceived(id)`: sets `status: "Received"` and `receivedDate: now`.
- `returnMatToList(id)`: sets `status: "On List"` and `receivedDate: null`.
- `removeReceivedMat(id)`: sets `status: "Removed"`. This is a soft delete kept for records, like frames (**Q11**).
- `setMatOrdered(id)` / `clearMatOrdered(id)`: toggles `orderedDate`.
- Every action calls `revalidatePath('/', 'layout')`.

### 7.3 Mat List page
**Heading:** "Mat List". On the right, above the table, place a **"Received Mats"** button to the left of the download button. It is a link to `/mats-to-order/received`, styled like the right-sidebar nav buttons: `bg-primary-dark text-white rounded-lg`, compact.

**Query:** `getMatList()`, which returns `MatToOrder` rows with `status: "On List"` whose order is not picked up (`order: { pickedUpAt: null }`, per **Q10**). Include `order`. Sort by order `dueDate` asc, then `orderNumber` asc, then position (Top, Second, Third). Prisma can't sort by a custom position order, so sort in JS after fetching.

**Columns:** Order # · Qty (`order.itemCount`) · Due Date · Size (`order.frameSize`) · Mat Indicator (`position`) · Mat SKU (`matSku`) · **Mat Received** · **Order**

**Buttons:** both are text pill buttons styled like "Ordered" in `order-list-table.tsx`.
- **Mat Received** calls `markMatReceived`, and the row falls off.
- **Order** is a toggle. It shows filled navy when `orderedDate` is set, like the vendor "Ordered" button. It has no other effect yet.

### 7.4 Received Mats page
**Heading:** "Received Mats". Put a "Mat List" link button back to the main list in the same spot as the "Received Mats" button. There is **no download button** on this page for now (**Q12**).

**Query:** `getReceivedMats()`, which returns rows with `status: "Received"` whose order is not picked up, using the same sort.

**Columns:** the same as Mat List, but replace the last two with **Return** and **Remove**.
- **Return** calls `returnMatToList`. The row disappears here and reappears on Mat List.
- **Remove** opens a confirmation modal. Copy the overlay styling from `components/customers/new-customer-modal.tsx` (`fixed inset-0` backdrop with a panel card). Text: "Are you sure you want to remove order {orderNumber} ({position} mat) from the list?" with **Yes** and **No** buttons.
  - **Yes** calls `removeReceivedMat` and closes the modal.
  - **No**, Esc, or a backdrop click closes the modal.
- Do not use `window.confirm`.

**Left-sidebar note:** the right sidebar has no active state today. The Received Mats route sits under `/mats-to-order/...`, which is fine.

---

## Task 8: Glass List (`/glass-review`)

The right sidebar already links "Glass List" to `/glass-review`. Keep that route.

The owner completed the spec in **Q14**.

**Heading:** "Glass List". Include the download button.

**Columns:** Order # · Qty (`itemCount`) · Due Date · Size (`frameSize`) · Glass (`glass`) · Mounting (`mounting`)

**Query:** `getGlassList()` returns orders with `completedAt: null`, `pickedUpAt: null` and `glass: { not: "No Glass" }`. Sort by due date, then order #.

**Not in scope yet:** row buttons, totals or grouping by glass type, and an oversize flag. These may come later.

---

## Suggested Order of Work and Commits

1. Phase 0 (shared components, revalidation, db helpers, seed fix), as **1 commit**
2. Tasks 1 and 2, as one commit each
3. Tasks 3 and 4, as one commit each
4. Tasks 5 and 6, as one shared commit
5. Task 7 schema and migration, as **1 commit**
6. Task 7 pages, as 1 commit
7. Task 8, as 1 commit
8. Docs: update `PROJECT_GUIDE.md` §3 (file tree), §4 (routes), §9 (move items to ✅) and §10 (Frames to Build is no longer "future"), and `context/data_guide.md` (MatToOrder, new queries), as 1 commit

Before **each** commit, run `npm run build` and `npm run lint` inside `frontend/`. Both must pass. **Commit locally only. Do not push** (**Q16**: option a). Pushing to `main` auto-deploys to Vercel, and the owner will push after review. The Mat List schema change must not go live before the Neon migration is run.

## Manual Test Script (run locally after all tasks)
1. Create a fresh state with `npm run db:reset`.
2. Open Orders to Verify and verify the top order. It should leave Verify and appear on Orders to Table.
3. Table it. It should leave Orders to Table.
4. On the Frame List, click Received for a verified order. It should appear on Frames to Build with a received date.
5. Mark it Built. If it is also tabled, it should appear on Orders to Fit.
6. Mark it Completed. It should leave Orders to Fit and appear on Binventory.
7. On Order Details, toggle Must Have on. It should appear on Must Have Orders. Toggle Delayed there; the row should stay, and it should appear on Delayed Orders.
8. Clear Must Have on the Must Have list. The row should leave.
9. On Mat List, check that an order with 3 mats shows 3 rows in Top, Second, Third order. Toggle Order on and off. Mark one row Received; only that row should move.
10. On Received Mats, click Return; the row should go back. Click Remove, then No; nothing should change. Click Remove, then Yes; the row should be gone from both lists.
11. Click download on each page that has one (every page except Received Mats). The print preview should hide buttons and show a clean table.
12. Check the layout at a narrow (laptop) width. Wide tables (Frames to Build, Mat List) should scroll horizontally inside their wrapper and not break the layout.

---

## Open Questions

Fill in each **My Answer** line. Where there is a recommendation, leaving it blank means "go with the recommendation."

**Q1. Button style on the list pages.** For Verify, Table, Frame Built and Completed, should the list pages use the round icon buttons already used on Daily Detail and Order Details (check, T, rectangle, smiley), or text pill buttons like the "Ordered" button on the vendor lists? Tasks 5 and 6 say Must Have and Delayed should match their other locations, which are icons.
*Recommendation:* use the round icon buttons everywhere, so the same status looks the same on every page.
**My Answer:** Use the round icon buttons everywhere.

**Q2. When should a row fall off?** Options:
- (a) Immediately after clicking.
- (b) The button fills in, and the row stays until the page is refreshed or revisited. A mis-click can then be undone right there.
- (c) Immediately, with a short "Undo" message for a few seconds.

As written, an order that falls off can only be un-marked from another page, such as Order Details.
*Recommendation:* (a) for now. (c) can be added later.
**My Answer:** (a) for now

**Q3. Should picked-up and completed orders be excluded?** tasks.md doesn't say that Verify, Table, Build and Fit should exclude **Picked Up** orders. It also doesn't say Orders to Fit should exclude **Completed** orders, although clicking Completed "falls off," which implies it.
*Recommendation:* exclude picked-up orders from all lists, and exclude completed orders from Orders to Fit.
**My Answer:** exclude picked-up orders from all lists, and exclude completed orders from Orders to Fit.

**Q4. Orders that never need a frame ordered.** Some orders have no Frame List or vendor record at all, for example a frame from stock or one supplied by the customer. As specified, these can never reach Frames to Build, but they can still reach Orders to Fit once marked Built elsewhere. Is that right, or should Frames to Build also show verified orders that have no frame record?
*Recommendation:* keep it as specified for now.
**My Answer:** Keep it as specified for now

**Q5. Qty on Frames to Build.** Orders have two quantities: `itemCount`, the items in the order and the "(x2)" shown everywhere, and `frameQty`, the number of frames. Which should Frames to Build show? Should the Mat List show `itemCount`?
*Recommendation:* `frameQty` on Frames to Build, and `itemCount` everywhere else.
**My Answer:** Where is frameQty used currently? Please let me know this as you find this answer so I can be sure of my final answer, but Lets use itemCount for now.

**Q6. Order type filtering.** Should these framing lists exclude orders whose Type is "Photo Services" or "Third Party"? All current dummy orders are "Framing".
*Recommendation:* no filter for now.
**My Answer:** No filter for now, we'll come back to this when we explore other order types.

**Q7. Printing.** When printing or downloading, should the button columns (Verify, Table, Must Have, etc.) be hidden, as on the vendor lists?
*Recommendation:* yes, hide them.
**My Answer:** Yes.

> **Note for the agent:** every question in this section (Q1–Q17) is answered, and the plan above already reflects the answers. They are kept here for the record.
>
> **Q5 follow-up (fact-check for the owner):** `frameQty` is stored in the database and passed through `lib/db.ts`, but **no page displays it anywhere**. Every "(xN)" on screen is `itemCount`. In the dummy data, `frameQty` equals `itemCount` on all 24 orders. A third quantity, `FrameToOrder.qty`, is what the vendor To Order list shows, and it sometimes differs (for example 2 or 3). Decision: use `itemCount` on every list.

**Q8. Mat List storage.** Received, removed and ordered status is per mat, so it needs a new database table (`MatToOrder`, described in 7.1). That means a database migration. After the code is pushed, **you** would need to run `prisma migrate deploy` and a one-time backfill script against the live Neon database. Is that OK?
**My Answer:** Yes but I will probably get your help for that.

**Q9. Mat "Order" button.** Should its on/off state be saved to the database (it stays filled after a refresh, on every device), or be visual-only for now?
*Recommendation:* save it, which is cheap since the table is being added anyway.
**My Answer:** Go with your recomendation

**Q10. Which orders' mats appear on the Mat List?** Options:
- (a) Every mat not yet received or removed, regardless of order status.
- (b) The same as (a), but hide mats on orders that are already Picked Up.
- (c) Only mats on orders that are not yet Tabled, since mats are cut at tabling.

*Recommendation:* (b).
**My Answer:** (b)

**Q11. Mat "Remove".** Should "Yes" soft-delete the row (hidden but kept in the database for records, like frames), or permanently delete it? Is there any way to bring a removed mat back?
*Recommendation:* soft-delete, with no restore for now.
**My Answer:** soft-delete, with no restore for now.

**Q12. Received Mats page extras.** Should it have its own download button, and a button back to the Mat List in the spot where "Received Mats" sits on the Mat List?
*Recommendation:* yes to both.
**My Answer:** No download button for now, but yes to a button back to the Mat List

**Q13. Mat SKU changes.** If an order's mat is changed later, for example on a future order edit page, what should happen to a mat that was already received? The plan stores a snapshot of the SKU; until an edit page exists this can't happen.
**My Answer:** We aren't going to deal with this currently.

**Q14. Glass List: the spec stops after the column list.** Please complete it:
- (a) Which orders appear? The plan assumes not completed, not picked up, and not "No Glass".
- (b) How should it be sorted? The plan assumes due date, then order #.
- (c) Any buttons per row (e.g. Received, Ordered, Remove), and what each does?
- (d) The lifecycle doc says this list is used to work out how many boxes of each glass type to order. Do you want a summary, such as totals per glass type or grouping by glass type?
- (e) Should oversize orders be flagged?

**My Answer:**
 - a: Not completed, not picked up, and not "No Glass"
 - b: Sorted by due date then order #
 - c: No buttons at this time
 - d: Not at this time but we may add that later.
 - e: Not at this time

**Q15. Seed data.** Is it OK to fix `seed.ts` (it currently fails on a removed column) and add a few "Received" frames, so Frames to Build and Orders to Fit have test data? This only affects your local database.
*Recommendation:* yes.
**My Answer:** Yes

**Q16. Commits and deploys.** Pushing to `main` auto-deploys to the live site. Should the agent:
- (a) commit locally per task and not push,
- (b) commit and push per task, or
- (c) work on a branch and open a PR?

*Recommendation:* (a). Push or merge after you've reviewed. The Mat List must not be pushed until you're ready to run the Neon migration (Q8), or the live site will break.
**My Answer:** (a)

**Q17. Description column.** tasks.md says Description "can be found on order details page." This plan uses the order's `description` field, which is what Order Details shows under the order number. Confirm that is the right field, rather than frame notes or mat notes.
**My Answer:** Yes that is right
