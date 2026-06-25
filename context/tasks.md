# Frame Shop App — Project Tasks

Structured task list converted from loose notes in CLAUDE.md (Project Updates → Tasks section).

---

## Phase 1: Core Status & Workflow

### 1.2 Picked Up Button — Order Search (Remaining)
**Status:** In Progress — Order Details & Binventory done; Order Search view still needed
**Description:**
The "Picked Up" button exists on Order Details and Binventory pages. It still needs to be added to the Order Search results (Task 2.4). When built, the button should:
- Set `pickedUpAt` timestamp in database
- Remove order from Binventory list
- Display prominently in search results

**Acceptance Criteria (remaining):**
- Picked Up button appears in Order Search results
- Clicking marks order as picked up in database
- Order disappears from Binventory

---

## Phase 2: New Pages & Features

### 2.4 Search Order Functionality
**Status:** Complete
**Description:**
Wire up the search box in the left panel (under "Current Orders") to return real order results.

**Search Behavior:**
- Magnifying glass icon or pressing Enter initiates search
- Clicking magnifying glass with empty input returns all orders, sorted: non-picked-up first, then by order number ascending
- Searchable by: order number, first name, last name, phone number

**Results Table Columns:**
- Order #
- Last Name
- First Name
- Bin (editable input field)
- Frame SKU
- Date (order taken)
- Verify button (toggles verified status, reflects `verifiedAt`)
- Picked Up button (sets `pickedUpAt`, same as Binventory)

**Row Detail:**
- Secondary row below each result showing staffer-inputted frame description

**Acceptance Criteria:**
- Search returns matching orders
- All columns display correctly
- Verify button is clickable and syncs with database
- Picked Up button works and removes order from Binventory
- Staffer frame description shows on secondary row
- Bin letter field is editable and saves to database
- Empty search returns all orders sorted correctly

---

---

## Phase 3: Supporting Lists

### 3.1 Mat List
**Status:** Lower priority
**Description:**
Create Mat List page showing available mats, organized similar to Frame List.

**Acceptance Criteria:**
- Page displays mats in logical grouping (by type/vendor or similar)
- Styled consistently with Frame List
- Accessible from left panel

---

### 3.2 Glass List
**Status:** Lower priority
**Description:**
Create Glass List page showing available glass options.

**Acceptance Criteria:**
- Page displays glass options in logical grouping
- Styled consistently with Frame List
- Accessible from left panel

---

### 3.3 Supply List
**Status:** Deferred — Not building immediately
**Description:**
List of regular supplies sorted by team-defined parameters. Include order buttons that route to specific vendor lists. Will need backend to let team update the supply list.

---

## Phase 4: Minor UI Fixes & Text Updates

---

## Audit & Cleanup

### 5.1 Functionality Audit
**Status:** Before next major phase
**Description:**
Create comprehensive list of all current implemented functionality (pages, buttons, data flow, status tracking). Helps align remaining data model changes with what the app currently does.

**Acceptance Criteria:**
- Documented list of all working features
- Documented list of partially-working features
- Documented list of data model gaps
- Identified misalignments between UI functionality and database structure

---

## Outstanding Client Questions

1. **Remove button & orderedDate** — If a frame is removed from the To Order list via the "Remove" button but the "Ordered" button was never clicked (so `orderedDate` is null), should we record an `orderedDate` at the time "Remove" is clicked? This would help with tracking whether a frame was ordered before being pulled from stock. Confirm with client before implementing.

---

## Backlog & Known Issues

Items that came up during development and should be addressed in future iterations.

1. **Frame Received status display** — Show contextual text based on frame status:
   - "Frame not ordered" — frame not yet on Frame List
   - "Frame ordered but not received" — on Frame List but not received
   - Show date when received
   - **Status:** Not yet implemented

2. **Order Details panel width** — Section containers should stretch further right; spacing should be symmetric on both sides.
   - **Status:** Not yet implemented

3. **Comments author capture** — `author` field exists in DB but not captured from UI; needs to tie to logged-in user or a name input.
   - **Status:** Partially implemented

---

## Completed Tasks

| # | Task | Description |
|---|------|-------------|
| 1.1 | Order Status Tracking Infrastructure | Migrated all status buttons from localStorage to database. Added 7 timestamp columns (`verifiedAt`, `tabledAt`, `builtAt`, `completedAt`, `pickedUpAt`, `mustHaveStatus`, `delayedStatus`) to Order schema. Created Server Actions in `src/app/actions/order-status.ts`. Note: `receivedAt` was initially added here then moved — see schema note below. |
| 2.1 | Daily Summaries Page | Built `/daily-summaries` page with 3 KPI boxes (Orders Taken, Completed, Picked Up), 3 filtered tables, and a calendar selector. Added `orderCreatedAt` timestamp to Order schema. API route at `/api/daily-summaries`. |
| 2.3 | Binventory Page | Built `/binventory` page showing completed-but-not-picked-up orders. Table with Bin, Order #, Qty, Customer Name, Contact, Due Date, and Picked Up button. Sort options (bin, due date, order #, customer name, asc/desc). |
| 4.2 | Bin Location Input | Fixed visual styling (no gap between parentheses, dynamic width expansion, no character cutoff). Fixed persistence bug — bin location now saves to database at any point in workflow, not just when order is completed. |
| 2.2 | All Orders Page | Built `/all-orders` page with 11 KPI boxes in a 4-4-3 grid. Clicking a KPI filters the table below. Each KPI has its own filter logic and specific extra columns. Table is horizontally scrollable for wide views like "All". Also: moved frame received tracking from `Order.receivedAt` to `FrameToOrder.receivedDate`; added `frameStatus`, `frameOrderedDate`, `frameReceivedDate` fields to Order interface sourced from FrameToOrder relation. |
| 4.1 | Button Label Changes | Frame List: "Order" button text no longer changes to "Ordered" when clicked. To Order lists: added "Ordered" button per row (writes `FrameToOrder.orderedDate` to DB via Server Action, navy fill when set) and "Remove" button per row (resets frame to "On List", clears `orderedDate`). Both buttons hidden from print. |
| 2.5 | Customer Directory | Built `/customers` directory page (alphabetical, client-side search by name/phone/email, New Customer modal), `/customers/[id]` detail page (all fields + order history), `/customers/[id]/edit` full-page edit. Top bar User icon and search wired to `/customers`. Required fields: First Name, Last Name, Phone, Contact Method. |
| 2.4 | Search Order Functionality | Wired up left panel "Current Orders" search box. Added `searchOrders` Prisma query (searches orderNumber, firstName, lastName, phone; empty query returns all orders sorted non-picked-up first then by orderNumber). Created `/order-search` page and `OrderSearchTable` component with columns: Order #, Last Name, First Name, Bin (editable), Frame SKU, Date Taken, Verify button, Picked Up button. Secondary row shows frameNotes when present. Added `customerFirstName`/`customerLastName` to Order type and mapOrder. |
| 4.1b | Frame/To Order Workflow Overhaul | Fully migrated Frame List and To Order list from localStorage to database. "Order" button sets `status='Ordered'` (moves to To Order list). "Ordered" button toggles `orderedDate`. "Frame List" button moves frame back (`status='On List'`). "Remove" sets `status='Removed'`, kept in DB. "Received" sets `status='Received'` + `receivedDate`. Right sidebar vendor links now DB-driven via server-fetched `getVendorsWithOrderedFrames()`. |

---

## Notes

- **Data Model:** Several tasks depend on finalizing the data schema with the client — confirm fields before building 2.2
- **UI Refinement:** Tasks in Phase 4 are quick wins that can be done in parallel with Phase 2–3 work
- **Planning Documents:** Created for complex tasks; delete after task completion
  - `context/planning/order_status_tracking.md` — Task 1.1 (can be deleted)
- **Schema decision — frame received date:** `receivedAt` was removed from the Order table. Frame received date is now `FrameToOrder.receivedDate`. All queries needing this value JOIN to FrameToOrder. `getOrdersReadyForFrameBuild()` requires both `verifiedAt` (on Order) and `frameToOrder.receivedDate` to be set.


# Notes to Self
- Need to add new order button to customer page and customer directory rows
- Need to remove Customer Type for now from the customer directory