# Frame Shop App — Project Tasks

Structured task list converted from loose notes in CLAUDE.md (Project Updates → Tasks section).

---

## Phase 1: Core Status & Workflow

### 1.1 Order Status Tracking Infrastructure
**Status:** Foundational — Required before most other features
**Planning Document:** `context/planning/order_status_tracking.md` *(delete after task completion)*
**Description:**
Establish database columns and app logic to track order progression through lifecycle:
- `receivedAt` — timestamp when frame was received
- `verifiedAt` — timestamp when order was verified
- `builtAt` — timestamp when frame was built
- `pickedUpAt` — timestamp when customer picked up order

Trigger: When Received button is clicked, log received status. When Verified button is clicked, mark verified.
Logic: Only move order to "Frames to Build" list when BOTH received AND verified are true.

**Key Implementation Details:**
- Timestamps stored as `DateTime?` (null = not done, Date = when completed)
- Received and Verified are independent statuses (can be set in any order)
- Migrate all existing status buttons from localStorage to database
- Include: Verified, Tabled, Frame Built, Completed

**Acceptance Criteria:**
- Schema updated with status timestamp columns
- Received button marks order as received
- Verified button marks order as verified
- Orders only appear in "Frames to Build" if both statuses are set
- Status mismatches (e.g., received but not verified) are tracked and visible
- All status buttons reading from database instead of localStorage

---

### 1.2 Picked Up Button & Functionality
**Status:** Dependent on 1.1
**Description:**
Add "Picked Up" button and timestamp display to:
- Order Details page (prominent, larger, more noticeable than other statuses)
- Binventory page (primary location for pickup workflow)
- Order search view

When clicked, set `pickedUpAt` timestamp and remove order from relevant lists.
Display `pickedUpAt` timestamp on order page (similar to status progression, but more prominent).

**Acceptance Criteria:**
- Button appears in all specified locations
- Clicking marks order as picked up in database
- Order disappears from Binventory and active order lists
- Timestamp is recorded for audit trail
- Picked Up status/timestamp is prominently displayed on order page
- Design is bigger and more noticeable than other status indicators

---

## Phase 2: New Pages & Features

### 2.1 Daily Summaries Page
**Status:** Medium priority
**Depends On:** Task 1.1 (Order Status Tracking)
**Description:**
New page showing daily snapshots of order progress. Includes:
- KPI metric boxes (4 totals at top):
  - Orders Taken (today)
  - Orders Completed (today)
  - Orders Picked Up (today)
  - Pending (not yet taken/completed)
- Three status tables below:
  - Orders Taken
  - Orders Completed
  - Orders Picked Up
- Calendar selector to view any day's summary (not just today)
- Show orders with mismatched status (received but not verified) — display on page for visibility

**Acceptance Criteria:**
- Page loads with current day's data
- KPI boxes display accurate counts
- Three tables show filtered orders by status
- Calendar selector changes date and updates all data
- Page accessible from left panel
- Received-but-not-verified orders visible (clarify desired display with user)

---

### 2.2 All Orders Page
**Status:** Medium priority — May be good place to showcase KPI metric boxes with drill-down
**Description:**
Show all in-house orders (from "taken" through "completed" through "waiting for pickup").
Explore: Could this page use dropdown KPI metric boxes that expand to show orders in each status? When you click an order number, navigate to Order Details.

**Acceptance Criteria:**
- Displays all in-house orders
- Filters/grouping by status (or KPI drill-down) works
- Clicking order number navigates to Order Details
- Page is accessible from left panel

---

### 2.3 Binventory Page (Completed Orders Waiting for Pickup)
**Status:** Medium priority
**Planning Document:** `context/planning/binventory-page.md` (to be created)
**Description:**
Show completed orders that are not yet picked up, organized by bin location. Staff retrieve orders from bins and mark them as picked up.

**Data Requirements:**
- Filter: `completedAt IS NOT NULL AND pickedUpAt IS NULL`
- Read fields: `binLocation`, `orderNumber`, `itemCount`, `customerId` → customer name, `customer.contactMethod`, `dueDate`
- Display: binLocation, orderNumber, quantity, customerName, contactMethod, dueDate, pickedUp button

**UI Layout:**
1. **Page Heading** — "Binventory" in same style as other main panel pages (navy bar)
2. **Sort Options** (above table):
   - Sort by: [Bin Name | Due Date | Order Number | Customer Name]
   - Direction: [↑ Ascending | ↓ Descending]
   - Default: Due Date (Ascending)
3. **Table** — styled like Frame List tables:
   - **Header row:** Navy background with white text, column names
   - **Data rows:** Alternating white and light-grey background for visual distinction
   - **Columns:**
     | Bin | Order # | Qty | Customer Name | Contact | Due Date | Picked Up |
     - Bin: the `binLocation` value (e.g., "A", "B", "C")
     - Order #: `orderNumber` (font-mono)
     - Qty: `itemCount` formatted as (x2)
     - Customer Name: customer's firstName + lastName
     - Contact: customer's `contactMethod` (Call, Text, Email)
     - Due Date: formatted date (e.g., 5/25/2026)
     - Picked Up: smaller version of the picked-up button (half the size of the Order Details button)
4. **Empty State:** If no completed-but-unpicked-up orders, show "No orders waiting for pickup"

**Styling Notes:**
- Table border: `border-primary-dark/15`
- Header: `bg-primary-dark`, `text-white`
- Rows: alternating `bg-white` and `bg-light-grey`
- Border between rows: `border-b border-primary-dark/10`
- Picked Up button: Navy circle when selected, gray border when not (same as Order Details but smaller)

**Functionality:**
- Click Picked Up button → calls Server Action to set `pickedUpAt` → order disappears from table
- Clicking order number → navigates to Order Details page
- Sort options update table dynamically (no page reload)

**Acceptance Criteria:**
- ✅ Displays only completed + not-yet-picked-up orders
- ✅ Table uses Frame List styling (navy header, alternating row colors)
- ✅ Sort options: bin name, due date, order number, customer name (asc/desc)
- ✅ Default sort: due date ascending
- ✅ Picked Up button (smaller size) works and removes order immediately
- ✅ Clicking order number opens Order Details
- ✅ Page heading matches other main panel pages
- ✅ Page accessible from right panel (and left panel in future)

---

### 2.4 Search Order Functionality
**Status:** Medium priority — Adapt existing search, align to current design
**Description:**
Adapt the original search functionality to current UI and add missing pieces:
- Columns: Order #, Last Name, First Name, Bin (with letter input field), Frame (SKU #), Date (order taken), Verify (button), Done (Picked Up button)
- Row below each result showing staffer-inputed frame description
- Verify button toggles state to show it's been clicked
- Done button marks order as picked up

**Acceptance Criteria:**
- Search returns orders matching criteria
- All columns display correctly
- Verify button is clickable and indicates state
- Done (Picked Up) button works
- Staffer description shows on secondary row
- Bin letter field is editable

---

### 2.5 Customer Directory
**Status:** Medium priority
**Planning Document:** `context/planning/customer-directory.md` (to be created)
**Description:**
Create a customer directory page accessible from the top bar. Display all customers with ability to:
- View customer details (name, phone, email, contact method, address, company, type, notes, etc.)
- Create new customers
- Edit existing customer information
- Search/filter customers by name, company, or type

**Data Display:**
- Table with columns: Customer Name, Phone, Email, Contact Method, Type, Company
- Click customer row → view/edit customer details modal or page
- Search bar at top to filter by name or company

**Subtask: Order Contact Method Display**
When implementing this task, also ensure:
- Customer contact method (`contactMethod`) is properly associated with orders
- Add `customerContactMethod` field to Order interface (COMPLETED in this commit)
- Update all order displays (Binventory, Daily Detail, Order Search) to show customer contact method
- This ensures staff can see preferred contact method when managing orders

**Acceptance Criteria:**
- ✅ Customer directory page accessible from top bar
- ✅ Display all customers in a table
- ✅ Search/filter functionality works
- ✅ Can create new customers with all required fields
- ✅ Can edit existing customer information
- ✅ Contact method displays correctly in all order views (Binventory, etc.)
- ✅ Page styling matches other main panels

---

## Phase 3: Supporting Lists

### 3.1 Mat List
**Status:** Lower priority — Use original design as inspiration
**Description:**
Create Mat List page showing available mats, organized similar to Frame List.
Reuse original mat list design patterns.

**Acceptance Criteria:**
- Page displays mats in logical grouping (by type/vendor or similar)
- Styled consistently with Frame List
- Accessible from left panel

---

### 3.2 Glass List
**Status:** Lower priority — Use original design as inspiration
**Description:**
Create Glass List page showing available glass options.
Reuse original glass list design patterns.

**Acceptance Criteria:**
- Page displays glass options in logical grouping
- Styled consistently with Frame List
- Accessible from left panel

---

### 3.3 Supply List (Future)
**Status:** Deferred — Not building immediately
**Description:**
(Not building now, but planned for future)
List of regular supplies sorted by team-defined parameters. Include order buttons that route to specific vendor lists. Will need backend to let team update the supply list.

---

## Phase 4: Minor UI Fixes & Text Updates

### 4.1 Button Label Changes
**Priority:** Low
**Tasks:**
- Frame List: Change "Order" button label (currently says "Ordered"?) — clarify desired label
- "To Order:" lists: Change button to past tense "Ordered" instead of "Order"
- "To Order:" lists: Add "Remove" button alongside "Ordered"

---

### 4.2 Bin Number Location Fix
**Priority:** Low
**Description:**
Bin number field (parentheses next to customer name on Order Details) doesn't look good. Redesign placement for better visual balance.

**Acceptance Criteria:**
- Bin number field is visually integrated and doesn't look awkward
- User can still add/edit bin letter

---

## Audit & Cleanup

### 5.1 Functionality Audit
**Status:** Before next major phase
**Description:**
Create comprehensive list of all current implemented functionality (pages, buttons, data flow, status tracking).
This will help align remaining data model changes with what the app currently does.

**Acceptance Criteria:**
- Documented list of all working features
- Documented list of partially-working features
- Documented list of data model gaps
- Identified misalignments between UI functionality and database structure

---

## Dependencies & Order of Implementation

**Recommended sequence:**
1. **1.1 Order Status Tracking** (foundational)
2. **1.2 Picked Up Button** (depends on 1.1)
3. **2.1 Daily Summaries** (medium effort, high visibility)
4. **2.3 Binventory** (depends on status tracking from 1.1)
5. **2.2 All Orders** (depends on status tracking)
6. **2.4 Search Order** (polish existing feature)
7. **4.1 Button Label Changes** (quick wins)
8. **4.2 Bin Number Fix** (quick UI improvement)
9. **3.1–3.3 Supporting Lists** (lower priority)
10. **5.1 Functionality Audit** (before planning next phase)

---

## Notes

- **localStorage → Database:** Most of these tasks will require migrating status tracking from localStorage to Server Actions + database mutations (Phase 2 work mentioned in project notes)
- **Data Model:** Several tasks depend on finalizing the data schema with the user's client — bin numbers, status columns, timestamps need confirmation
- **UI Refinement:** Tasks in Phase 4 are small wins that can be done in parallel with Phase 2–3 work

## Planning Documents

Planning documents are created for complex tasks to break down implementation steps. **Delete after task completion.**

- **Task 1.1:** `context/planning/order_status_tracking.md` — Schema changes, Server Actions, UI updates, migration strategy


## Task Intake
1. On order page, when there is no Frame Received date it currently says Invalid Date. I want to eventually update this so that it shows the following:
  - When order is created the frame goes to the Frame List linked on right panel - when that happens and neither Order nor Received have been clicked, it should say Frame Received: Frame not ordered
  - When frame for order has been ordered but not received it should say "Frame Received: Frame ordered but not received"
  - When received button has been clicked it should do as it currently does and list the receivedAt date

2. On order detailes page I want the elements in the main panel, the different rectangle divs with the blue borders, to stretch further over to the right side of the panel. The spacing between those divs and the sides of the panel should be the same from the right side as it is for the left.

3. Need to make sure comments are written to database with timestamp and staffer who commented.

4. None of the dates are showing up in the app since moving to database. 


Geoffrey Harrison:
	Quick question. Are all the bins labeled as single capital letters? And if so how far into the alphabet do they go?

Jeff Ballance:
	Welll mostly! So they go A-L then we have P, P-2, P-4, Pcounter, Pwall, Wall, Nook, Cranny

  Bins:
  - Letters A through L
  - P
  - P-2
  - P-4
  - Pcounter
  - Pwall
  - Wall
  - Nook
  - Cranny