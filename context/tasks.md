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
**Status:** Not yet started
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

### 2.5 Customer Directory
**Status:** Not yet started
**Description:**
Create a customer directory page accessible from the top bar. Display all customers with ability to view, create, and edit customer records.

**Data Display:**
- Table with columns: Customer Name, Phone, Email, Contact Method
- Click customer name → view customer details page
- Search bar at top to filter by name, phone, or email
- New Customer button near top of panel
- Heading at top of panel that says "Customer Directory"

**Acceptance Criteria:**
- Customer directory page accessible from top bar
- Top panel customer directory button (currently exists, sits to left of customer search bar) should take you to directory with all customers listed in alphabetical order based on last name
- Top panel customer search bar - when used should return customer directory filtered to just customers that matched search criteria
- Displays all customers in a table
- Search/filter by name or phone or email works
- Can create new customers with all required fields
- Can edit existing customer information - edit button will sit in customer profile pages
- Page styling matches other main panels

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

### 4.1 Button Label Changes
**Priority:** Low
**Tasks:**
- Frame List: Clarify desired label for "Order" button
- "To Order:" lists: Change button to past tense "Ordered" instead of "Order"
- "To Order:" lists: Add "Remove" button alongside "Ordered"

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

---

## Notes

- **Data Model:** Several tasks depend on finalizing the data schema with the client — confirm fields before building 2.2
- **UI Refinement:** Tasks in Phase 4 are quick wins that can be done in parallel with Phase 2–3 work
- **Planning Documents:** Created for complex tasks; delete after task completion
  - `context/planning/order_status_tracking.md` — Task 1.1 (can be deleted)
- **Schema decision — frame received date:** `receivedAt` was removed from the Order table. Frame received date is now `FrameToOrder.receivedDate`. All queries needing this value JOIN to FrameToOrder. `getOrdersReadyForFrameBuild()` requires both `verifiedAt` (on Order) and `frameToOrder.receivedDate` to be set.