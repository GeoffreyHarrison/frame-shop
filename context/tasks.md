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
**Description:**
Show orders that are completed but not yet picked up. Include:
- Primary sorting/grouping by bin number
- Secondary sort options: order number, due date
- "Picked Up" button for each order (marks as picked up, removes from list)

**Acceptance Criteria:**
- Displays only completed + not-yet-picked-up orders
- Grouped/sorted by bin number by default
- Sort dropdown allows switching to order number or due date
- "Picked Up" button works and removes order from list
- Page accessible from right panel

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


## My Answers
1. You should have the following timestamp comlumns, included is what they map to. Some of the buttons will be in multiple locations even if I list just one:
  - `receivedAt` — timestamp when frame was received from vendor - button is on "To Order:" lists on right panel 
  - `verifiedAt` — timestamp when order was verified (aka staffer double checked all measurements) - button is check mark button on order page
  - `builtAt` — timestamp when frame was built by staffer - button is vertical rectangle button on order page
  - `tabledAt` - timestamp when order was "tabled" aka a staffer cut and mounted mats and hit the "Tabled" button - button is T button on order page
  - `pickedUpAt` — timestamp when customer picked up order - currently don't have button for this, part of future development
  - `mustHaveStatus` - timestamp when staffer marked order as "Must Have" - button is star button on order page
  - `delayedStatus` - timestamp when staffer marked order as "Delayed" - button is exclamation button on order page
  - `completedAt` - timestamp when staffer marked order as "Complete", happens after all other steps except picked up, after this staffer places order in a bin and updates order with that bin's letter, then contacts customer through preffered contact method to inform them that the order is ready for pickup - button is smiley face button on order page.
  - `binLocation` - string column that contains letter of bin the order is stored in. This is different from our other status timestamp columns, but is an important datapoint to track as it will inform staffers where to find the order. 

2. I included them above, but lets store them as timestamps just in case the owner and manager want to see when an order was marked delayed or must have. Then use the prescense of a timestamp to indicate whether that button should be active or not.

3. We will spec that out when we spec out the Daily Summaries page more.