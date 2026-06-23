# Order Status Tracking — Implementation Plan

**Related Task:** [1.1 Order Status Tracking Infrastructure](../tasks.md#11-order-status-tracking-infrastructure)  
**Planning Document:** `context/planning/order_status_tracking.md` — Delete after task completion

---

## Overview

Migrate order status tracking from localStorage to PostgreSQL database. Add nine new columns to Order model: eight timestamp columns tracking order lifecycle events (Received, Verified, Tabled, Built, Completed, Picked Up, Must Have, Delayed), plus one string column for bin location. Implement Server Actions to handle status updates and display logic based on timestamp presence (null = not done, Date = completed).

---

## Phase 1: Schema Changes

### 1.1 Add Status Columns to Order Model

Update `frontend/prisma/schema.prisma`:

```prisma
model Order {
  // ... existing fields ...
  
  // Status timestamps (null = not yet done, Date = when completed)
  receivedAt      DateTime?     // Frame received from vendor
  verifiedAt      DateTime?     // Order verified (measurements checked by staffer)
  tabledAt        DateTime?     // Mats cut/mounted, "tabled" by staffer
  builtAt         DateTime?     // Frame built by staffer
  completedAt     DateTime?     // Order marked complete (ready for pickup)
  pickedUpAt      DateTime?     // Customer picked up order
  mustHaveStatus  DateTime?     // Marked as "Must Have" by staffer
  delayedStatus   DateTime?     // Marked as "Delayed" by staffer
  
  // Non-timestamp status data
  binLocation     String?       // Letter of bin where completed order is stored (e.g., "A", "B", "C")
  
  // ... rest of model ...
}
```

**Rationale:** 
- Timestamps double as both status flags (null = not done) and audit trail
- `binLocation` is a string since it's a categorical identifier, not a timestamp
- All timestamps are optional — orders start with all null
- Presence of timestamp indicates button should be active/selected

### 1.2 Create Prisma Migration

From `frontend/` folder:

```bash
npx prisma migrate dev --name add_order_status_columns
```

This creates:
- Migration file in `frontend/prisma/migrations/`
- Updates Prisma client

---

## Phase 2: Database Migrations

### 2.1 Backfill Existing Orders (Seed)

Update `frontend/prisma/seed.ts` to initialize status columns on dummy data. Since dummy orders are reset frequently, set sensible defaults:
- All dummy orders: `receivedAt` = immediate (frame already received from vendor)
- Some: also set `verifiedAt`, `tabledAt`, `builtAt` to simulate orders in progress
- A few: set `completedAt` and `binLocation` to simulate ready-for-pickup orders
- Mix in some with `mustHaveStatus` or `delayedStatus` set

This ensures you can test the full workflow and see different order states immediately.

---

## Phase 3: Server Actions

Create `frontend/src/app/actions/order-status.ts` with the following Server Actions:

### 3.1 `updateOrderStatus(orderId: string, status: StatusType)`

Sets the corresponding timestamp to **now** if not already set. Status types:
- `'received'`, `'verified'`, `'tabled'`, `'built'`, `'completed'`, `'pickedUp'`, `'mustHave'`, `'delayed'`

```typescript
'use server'

import { prisma } from '@/lib/prisma'

type StatusType = 'received' | 'verified' | 'tabled' | 'built' | 'completed' | 'pickedUp' | 'mustHave' | 'delayed'

export async function updateOrderStatus(
  orderId: string,
  status: StatusType
) {
  const statusField = {
    received: 'receivedAt',
    verified: 'verifiedAt',
    tabled: 'tabledAt',
    built: 'builtAt',
    completed: 'completedAt',
    pickedUp: 'pickedUpAt',
    mustHave: 'mustHaveStatus',
    delayed: 'delayedStatus',
  }[status] as const

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { [statusField]: new Date() },
  })

  return updated
}
```

### 3.2 `clearOrderStatus(orderId: string, status: StatusType)`

Sets the corresponding timestamp to **null** (removes the status).

```typescript
export async function clearOrderStatus(
  orderId: string,
  status: StatusType
) {
  const statusField = {
    received: 'receivedAt',
    verified: 'verifiedAt',
    tabled: 'tabledAt',
    built: 'builtAt',
    completed: 'completedAt',
    pickedUp: 'pickedUpAt',
    mustHave: 'mustHaveStatus',
    delayed: 'delayedStatus',
  }[status] as const

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { [statusField]: null },
  })

  return updated
}
```

### 3.3 `getOrdersReadyForFrameBuild()`

Returns orders where **both** `receivedAt` AND `verifiedAt` are set (not null), and `builtAt` is null.

```typescript
export async function getOrdersReadyForFrameBuild() {
  return await prisma.order.findMany({
    where: {
      receivedAt: { not: null },
      verifiedAt: { not: null },
      builtAt: null, // not yet built
    },
    include: { customer: true },
    orderBy: { dueDate: 'asc' },
  })
}
```

### 3.4 `updateBinLocation(orderId: string, binLetter: string)`

Sets the bin location (e.g., "A", "B", "C") where the completed order is stored.

```typescript
export async function updateBinLocation(
  orderId: string,
  binLetter: string
) {
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { binLocation: binLetter },
  })

  return updated
}
```

---

## Phase 4: UI Component Updates

### 4.1 Status Button Components & Locations

Update status button components to:
1. **Read** the timestamp from the Order object
2. **Dispatch** the Server Action (updateOrderStatus / clearOrderStatus) on click
3. **Toggle** visual state based on whether timestamp is null or not

**Button Locations:**

| Status | Button Location | Component File | UI Style |
|--------|-----------------|-----------------|----------|
| `receivedAt` | Right panel, "To Order:" lists | `frontend/src/components/frames/order-list-table.tsx` | Mark frame received from vendor |
| `verifiedAt` | Order Details page, status buttons section | `frontend/src/components/framing-orders/order-details.tsx` | Check mark button (✓) |
| `tabledAt` | Order Details page, status buttons section | `frontend/src/components/framing-orders/order-details.tsx` | Capital T button |
| `builtAt` | Order Details page, status buttons section | `frontend/src/components/framing-orders/order-details.tsx` | Vertical rectangle button |
| `completedAt` | Order Details page, status buttons section | `frontend/src/components/framing-orders/order-details.tsx` | Smiley face button |
| `pickedUpAt` | Order Details page, prominent display + Binventory page | `frontend/src/components/framing-orders/order-details.tsx` | Large button (future task 1.2) |
| `mustHaveStatus` | Order Details page, status buttons section | `frontend/src/components/framing-orders/order-details.tsx` | Star button (⭐) |
| `delayedStatus` | Order Details page, status buttons section | `frontend/src/components/framing-orders/order-details.tsx` | Exclamation mark button (!) |

**Implementation Pattern:**
```typescript
const isVerified = order.verifiedAt !== null

const handleVerifyClick = async () => {
  if (isVerified) {
    await clearOrderStatus(order.id, 'verified')
  } else {
    await updateOrderStatus(order.id, 'verified')
  }
  // Refetch or use optimistic update
}
```

### 4.2 Bin Location Input

Add a text input field on Order Details page to update `binLocation`. Appears after order is `completedAt`.
```typescript
const handleBinChange = async (binLetter: string) => {
  await updateBinLocation(order.id, binLetter)
}
```

### 4.3 "Frames to Build" List

Awaiting client UX direction — but the query is ready:
```typescript
const framesToBuild = await getOrdersReadyForFrameBuild()
```

Returns orders where both `receivedAt` AND `verifiedAt` are set, but `builtAt` is null.

### 4.4 Order Page Status Display

Show all status progression prominently on Order Details page. Example layout:
```
Received:  [✓ icon] Jun 20, 2026 2:30 PM
Verified:  [✓ icon] Jun 20, 2026 2:35 PM
Tabled:    [✓ icon] Jun 20, 2026 2:40 PM
Built:     [ ] —
Completed: [ ] —
Picked Up: [ ] — (make larger/more prominent in task 1.2)

Must Have: [✓ icon]
Delayed:   [ ]

Bin: [A] (input field after completed)
```

---

## Phase 5: Migrate Existing Status Data

### 5.1 Button Mapping (Confirmed)

Existing buttons map to new timestamp columns:
- **Check Mark (✓)** → `verifiedAt` — Order verified (measurements checked)
- **Capital T** → `tabledAt` — Mats cut/mounted
- **Vertical Rectangle** → `builtAt` — Frame built by staffer
- **Smiley Face** → `completedAt` — Order marked complete (ready for pickup)
- **Star** → `mustHaveStatus` — Marked as "Must Have" priority
- **Exclamation (!)** → `delayedStatus` — Marked as "Delayed"

### 5.2 localStorage → Database Migration

**Affected components:**
- `frontend/src/lib/order-statuses.ts` (Verified, Tabled, Built, Completed, Must Have, Delayed)
- `frontend/src/lib/vendor-orders.ts` (Received button state on "To Order:" lists)

**Approach:**
1. Keep localStorage as fallback during transition
2. On page load, check if data exists in DB; if not, seed from localStorage
3. Gradually remove localStorage checks once confident in database data

**Note:** All existing status data in localStorage needs to be migrated. Since timestamps are new, backfill with current date/time for any existing statuses that are true in localStorage.

---

## Phase 6: Query Layer Updates

Update `frontend/src/lib/db.ts` to include all status timestamps in all queries:

```typescript
function mapOrder(dbOrder: any): Order {
  return {
    // ... existing fields ...
    // Status timestamps (convert Date to ISO string for client)
    receivedAt: dbOrder.receivedAt?.toISOString() || null,
    verifiedAt: dbOrder.verifiedAt?.toISOString() || null,
    tabledAt: dbOrder.tabledAt?.toISOString() || null,
    builtAt: dbOrder.builtAt?.toISOString() || null,
    completedAt: dbOrder.completedAt?.toISOString() || null,
    pickedUpAt: dbOrder.pickedUpAt?.toISOString() || null,
    mustHaveStatus: dbOrder.mustHaveStatus?.toISOString() || null,
    delayedStatus: dbOrder.delayedStatus?.toISOString() || null,
    binLocation: dbOrder.binLocation || null,
  }
}
```

Update `frontend/src/lib/types.ts` Order interface:

```typescript
export interface Order {
  // ... existing ...
  // Status timestamps
  receivedAt?: string | null
  verifiedAt?: string | null
  tabledAt?: string | null
  builtAt?: string | null
  completedAt?: string | null
  pickedUpAt?: string | null
  mustHaveStatus?: string | null
  delayedStatus?: string | null
  binLocation?: string | null
}
```

---

## Implementation Checklist

**Database**
- [ ] Add 9 new columns to Prisma schema (8 timestamps + 1 string)
- [ ] Create and run migration: `npx prisma migrate dev --name add_order_status_columns`
- [ ] Backfill dummy data in seed.ts with varied status combinations

**Server Actions**
- [ ] Create `frontend/src/app/actions/order-status.ts`
- [ ] Implement `updateOrderStatus()` with all 8 status types
- [ ] Implement `clearOrderStatus()` with all 8 status types
- [ ] Implement `getOrdersReadyForFrameBuild()` (received + verified, not built)
- [ ] Implement `updateBinLocation()` for bin assignment
- [ ] Test Server Actions locally

**Query Layer**
- [ ] Update `db.ts` `mapOrder()` to include all 9 new columns
- [ ] Update `types.ts` Order interface with all new fields
- [ ] Test queries return correct data including new columns

**UI Components**
- [ ] Update buttons in `order-details.tsx`:
  - [ ] Check mark button → reads `verifiedAt`, toggles with Server Action
  - [ ] T button → reads `tabledAt`, toggles with Server Action
  - [ ] Rectangle button → reads `builtAt`, toggles with Server Action
  - [ ] Smiley button → reads `completedAt`, toggles with Server Action
  - [ ] Star button → reads `mustHaveStatus`, toggles with Server Action
  - [ ] Exclamation button → reads `delayedStatus`, toggles with Server Action
  - [ ] Bin location input field (appears after completedAt is set)
  - [ ] Placeholder for Picked Up button/section (implement in task 1.2)
- [ ] Update "Received" button on `order-list-table.tsx` (To Order lists)
  - [ ] Reads `receivedAt`, toggles with Server Action
- [ ] Update order page status display section with all timestamps in readable format

**localhost Testing**
- [ ] Verify each button sets correct timestamp when clicked
- [ ] Verify each button clears timestamp when clicked again
- [ ] Verify orders with both received + verified appear in Frames to Build query
- [ ] Verify orders with received but not verified show on order page
- [ ] Verify bin location input saves correctly
- [ ] Test cross-page consistency (status set on order page reflects in other pages)

**Deployment**
- [ ] Migration runs on Vercel before app deploys
- [ ] Seed data updated and backfill complete
- [ ] All Server Actions work in production

---

## Clarifications Received from User

✅ **Button Mapping:** Confirmed mapping of all buttons to timestamp columns:
- Check mark → `verifiedAt`
- T button → `tabledAt`
- Rectangle → `builtAt`
- Smiley → `completedAt`
- Star → `mustHaveStatus`
- Exclamation → `delayedStatus`
- Received (on To Order lists) → `receivedAt`

✅ **Storage Approach:** Store all as timestamps (no boolean flags). Presence of timestamp = button active.

✅ **Bin Location:** Add `binLocation` string column for bin letter.

## Open Questions (Remaining)

1. **Daily Summaries Display:** How should received-but-not-verified orders be visually represented in the summary? (Will spec separately with daily summaries task)
2. **Frames to Build Page:** Once client direction arrives, this plan is 90% ready — just need the UI spec.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| localStorage data lost during migration | Keep localStorage as fallback; sync both during transition |
| Timestamps in different timezones | Store all as UTC; format on client as needed per user's timezone |
| Users clicking status multiple times | Server Action idempotent (clicking again clears, clicking again sets) |
| Performance on large order lists | Add indexes to `receivedAt`, `verifiedAt` columns if needed |

---

## Dependencies

- Prisma migration must run before app deploys
- Server Actions require Next.js 14+ (already have 16.2.6 ✓)
- Database must have new columns before app tries to read them

