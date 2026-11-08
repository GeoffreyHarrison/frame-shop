-- CreateTable
CREATE TABLE "MatToOrder" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "matSku" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'On List',
    "orderedDate" TIMESTAMP(3),
    "receivedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatToOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatToOrder_orderId_position_key" ON "MatToOrder"("orderId", "position");

-- AddForeignKey
ALTER TABLE "MatToOrder" ADD CONSTRAINT "MatToOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
