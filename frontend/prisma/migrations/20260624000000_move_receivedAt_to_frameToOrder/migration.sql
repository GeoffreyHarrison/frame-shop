-- Move frame received tracking from Order.receivedAt to FrameToOrder.receivedDate
-- receivedDate on FrameToOrder is the canonical source of truth for when a frame arrived

-- Add receivedDate to FrameToOrder
ALTER TABLE "FrameToOrder" ADD COLUMN "receivedDate" TIMESTAMP(3);

-- Remove receivedAt from Order (data loss is acceptable — seed data only)
ALTER TABLE "Order" DROP COLUMN "receivedAt";
