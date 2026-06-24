# Frame Shop Database Schema Guide

This document describes the structure of the Frame Shop database, including all tables (models), their fields, and what each field represents.

---

## Overview

The database currently has 4 main tables:
1. **Customer** — Stores customer information
2. **Order** — Stores framing orders and their status
3. **Comment** — Stores notes/comments attached to orders
4. **FrameToOrder** — Tracks frame inventory orders from vendors

---

## Tables

### Customer

Stores information about customers who place orders, including contact details and preferences.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | ✓ | Unique identifier (auto-generated) |
| `firstName` | String | ✓ | Customer's first name |
| `lastName` | String | ✓ | Customer's last name |
| `phone` | String | ✓ | Primary phone number |
| `secondPhone` | String | | Alternate phone number |
| `email` | String | | Email address |
| `contactMethod` | String | ✓ | Preferred contact method: "Call", "Text", or "Email" |
| `address` | String | ✓ | Street address |
| `suite` | String | | Suite/apartment number (if applicable) |
| `city` | String | ✓ | City |
| `state` | String | ✓ | State |
| `zip` | String | ✓ | ZIP code |
| `spouse` | String | | Spouse's name (if applicable) |
| `company` | String | | Company name (if business customer) |
| `type` | String | ✓ | Customer type: "Customer", "Decorator", "Artist", or "Vendor" |
| `rewards` | Boolean | ✓ | Whether customer is in rewards program (default: false) |
| `discount` | Float | ✓ | Discount percentage (default: 0) |
| `taxable` | Boolean | ✓ | Whether customer is taxable (default: true) |
| `taxId` | String | | Tax ID number (if applicable) |
| `notes` | String | | General notes about customer |
| `createdAt` | DateTime | ✓ | When the customer record was created (auto-set) |
| `updatedAt` | DateTime | ✓ | When the customer record was last updated (auto-updated) |

**Relationships:**
- Has many `Order` records (one customer can have multiple orders)

---

### Order

The core table storing framing orders and their status throughout the workflow. Tracks frame details, mat selections, glass type, mounting method, and progression through the order lifecycle.

#### Basic Order Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | ✓ | Unique identifier (auto-generated) |
| `orderNumber` | String | ✓ | Unique order number (e.g., "24-1001") |
| `customerId` | String | ✓ | Foreign key to Customer |
| `description` | String | ✓ | What is being framed (e.g., "Wedding photo - bride and groom") |
| `dueDate` | DateTime | ✓ | When the order is due for customer pickup |
| `takenDate` | DateTime | ✓ | When the order was taken/created |
| `orderCreatedAt` | DateTime | ✓ | When order was created by staff (for KPI tracking) |

#### Order Type & Location

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | String | ✓ | Order type: "Framing", "Photo Services", "Do at Epps", "Third Party" (default: "Framing") |
| `store` | String | ✓ | Which store location: "Epps", "Cedar", or "Web" |
| `designer` | String | ✓ | Staff member's initials who designed the order |

#### Pricing & Quantities

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `totalPrice` | Float | ✓ | Total price of the order |
| `codPrice` | Float | ✓ | Cash on delivery price (if applicable, default: 0) |
| `itemCount` | Int | ✓ | Number of items in order (default: 1) |

#### Frame Details

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `frameSku` | String | ✓ | Frame SKU number (e.g., "LJ-4892") |
| `frameNotes` | String | ✓ | Frame description (e.g., "Gold Lined") |
| `frameQty` | Int | ✓ | Quantity of frames (default: 1) |
| `frameSize` | String | ✓ | Frame size (e.g., "16x20") |
| `footage` | Float | ✓ | Linear footage of frame |

#### Mat Details

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `topMat` | String | | Top/outer mat color code (e.g., "W1234") |
| `secondMat` | String | | Second mat color code |
| `thirdMat` | String | | Third mat color code |
| `matNotes` | String | | Description of mat arrangement (e.g., "White over blue") |
| `matWidthLessThan` | Boolean | ✓ | Whether mat width is less than 1-3/4" (default: false) |

#### Glass & Assembly

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `glass` | String | ✓ | Glass type: "No Glass", "Conclr", "AR", "Museum", "Regular", "NonGlare", "Plexi", "Plexi-Museum", "Conngl", "Plexi-RC", "Plexi-OP3", or "Other" |
| `overSize` | Boolean | ✓ | Whether order is oversized (default: false) |
| `mounting` | String | ✓ | Mounting method: "Hinge", "Dry Mount", "Float Mnt", "Sew Down", "Glue Down", "Stretch", "Stretch & Blck", "Gallery Wrap", "Photo Mount", or "Museum" |

#### Legacy Status Fields (Being Phased Out)

These boolean fields track status as yes/no. They're being replaced by timestamp-based fields below.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `verified` | Boolean | false | Legacy: whether order was verified |
| `verifiedDate` | DateTime | null | Legacy: when order was verified |
| `tabled` | Boolean | false | Legacy: whether mats were cut/mounted |
| `tabledDate` | DateTime | null | Legacy: when mats were cut |
| `frameBuilt` | Boolean | false | Legacy: whether frame was built |
| `frameBuiltDate` | DateTime | null | Legacy: when frame was built |
| `frameReceived` | Boolean | false | Legacy: whether frame was received |
| `frameReceivedDate` | DateTime | null | Legacy: when frame was received |
| `completed` | Boolean | false | Legacy: whether order was completed |
| `completedDate` | DateTime | null | Legacy: when order was completed |
| `delayed` | Boolean | false | Legacy: whether order is delayed |
| `must` | Boolean | false | Legacy: whether order is marked as must-have/priority |

#### New Status Timestamp Fields (Active)

These DateTime fields track when each status was set. `null` means the status hasn't been set yet.

| Field | Type | Description |
|-------|------|-------------|
| `receivedAt` | DateTime | Timestamp when frame was received from vendor |
| `verifiedAt` | DateTime | Timestamp when order was verified (measurements confirmed) |
| `tabledAt` | DateTime | Timestamp when mats were cut and mounted |
| `builtAt` | DateTime | Timestamp when frame was assembled and glass installed |
| `completedAt` | DateTime | Timestamp when order was completed and ready for pickup |
| `pickedUpAt` | DateTime | Timestamp when customer picked up the order |
| `mustHaveStatus` | DateTime | Timestamp when marked as high-priority/must-have |
| `delayedStatus` | DateTime | Timestamp when marked as delayed |

#### Other Fields

| Field | Type | Description |
|-------|------|-------------|
| `binLocation` | String | Bin name/letter where completed order is stored (e.g., "A", "Pcounter", "Wall") |
| `notes` | String | General notes about the order |
| `createdAt` | DateTime | When the order record was created (auto-set) |
| `updatedAt` | DateTime | When the order record was last updated (auto-updated) |

**Relationships:**
- Belongs to one `Customer` (via `customerId`)
- Has many `Comment` records (one order can have multiple comments)
- Has zero or one `FrameToOrder` record (frame ordering info for this order)

---

### Comment

Stores notes and comments attached to orders. Used for staff communication about order details, customer requests, and workflow notes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | ✓ | Unique identifier (auto-generated) |
| `orderId` | String | ✓ | Foreign key to Order |
| `author` | String | ✓ | Initials or name of staff member who wrote comment |
| `text` | String | ✓ | The comment text |
| `createdAt` | DateTime | ✓ | When the comment was created |

**Relationships:**
- Belongs to one `Order` (via `orderId`)

**Notes:**
- Comments are currently read-only after creation (no update/delete capability)
- The `author` field should be captured from the current user when comments are created through the UI

---

### FrameToOrder

Tracks frame inventory that needs to be ordered from vendors. Separate from orders—this is for frame sourcing/procurement workflow.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | ✓ | Unique identifier (auto-generated) |
| `orderId` | String | ✓ | Foreign key to Order (which order needs this frame) |
| `frameSku` | String | ✓ | Frame SKU to order (e.g., "LJ-4892") |
| `frameNotes` | String | ✓ | Frame description (e.g., "Gold Lined") |
| `footage` | Float | ✓ | Linear footage of frame needed |
| `size` | String | ✓ | Frame size (e.g., "16x20") |
| `qty` | Int | ✓ | Quantity to order |
| `vendor` | String | ✓ | Vendor name: "Larson Juhl", "Decor Moulding", "Roma Moulding", or "Bella Moulding" |
| `status` | String | ✓ | Order status: "On List", "Ordered", or "Received" (default: "On List") |
| `orderedDate` | DateTime | | When the frame was ordered from vendor |
| `createdAt` | DateTime | ✓ | When this record was created (auto-set) |
| `updatedAt` | DateTime | ✓ | When this record was last updated (auto-updated) |

**Relationships:**
- Belongs to one `Order` (via `orderId`)

**Notes:**
- One order can have one frame-to-order record (one-to-one relationship)
- Used by the Frame List to show frames that need ordering
- When a frame is marked "Ordered", it moves to vendor-specific order lists

---

## Data Type Reference

- **String** — Text data (no length limit in the schema, but typically reasonable lengths)
- **Int** — Integer numbers (whole numbers)
- **Float** — Decimal numbers
- **Boolean** — True/false values
- **DateTime** — Date and time (stored as timestamps)

**Modifiers:**
- `?` — Optional field (can be null)
- No `?` — Required field (must have a value)
- `@default(value)` — Field automatically gets this value if not provided
- `@unique` — This field must be unique across all records
- `@id` — Primary key (unique identifier for the row)

---

## Key Relationships

```
Customer (1) ──────── (Many) Order
                         │
                         ├── (Many) Comment
                         └── (0-1) FrameToOrder
```

- Each **Customer** can have multiple **Orders**
- Each **Order** can have multiple **Comments**
- Each **Order** can have zero or one **FrameToOrder** (for frame sourcing)

---

## Common Queries

### Get all orders for a customer
Requires: `customerId`

### Get all pending orders (not yet completed)
Filter: `completedAt IS NULL`

### Get orders ready for pickup
Filter: `completedAt IS NOT NULL AND pickedUpAt IS NULL`

### Get orders due on a specific date
Filter: `dueDate` matches the date

### Get orders created on a specific date
Filter: `orderCreatedAt` matches the date

### Get orders completed on a specific date
Filter: `completedAt` matches the date

---

## Status Workflow

Orders progress through these statuses in typical workflow order:

1. **Created** — Order entered into system
2. **Received** — Frame arrives from vendor
3. **Verified** — Measurements double-checked
4. **Tabled** — Mats cut and mounted
5. **Built** — Frame assembled with glass
6. **Completed** — Order ready for pickup
7. **Picked Up** — Customer collected the order

Additional statuses (can be set at any time):
- **Must Have** — High-priority order
- **Delayed** — Order has delays/issues

