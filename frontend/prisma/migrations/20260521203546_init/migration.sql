-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "contactMethod" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "suite" TEXT,
    "spouse" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "email" TEXT,
    "secondPhone" TEXT,
    "company" TEXT,
    "rewards" BOOLEAN NOT NULL DEFAULT false,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL DEFAULT 'Customer',
    "taxable" BOOLEAN NOT NULL DEFAULT true,
    "taxId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "takenDate" TIMESTAMP(3) NOT NULL,
    "must" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL DEFAULT 'Framing',
    "store" TEXT NOT NULL,
    "designer" TEXT NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "codPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "itemCount" INTEGER NOT NULL DEFAULT 1,
    "frameSku" TEXT NOT NULL,
    "frameNotes" TEXT NOT NULL,
    "frameQty" INTEGER NOT NULL DEFAULT 1,
    "frameSize" TEXT NOT NULL,
    "footage" DOUBLE PRECISION NOT NULL,
    "topMat" TEXT,
    "secondMat" TEXT,
    "thirdMat" TEXT,
    "matNotes" TEXT,
    "matWidthLessThan" BOOLEAN NOT NULL DEFAULT false,
    "glass" TEXT NOT NULL,
    "overSize" BOOLEAN NOT NULL DEFAULT false,
    "mounting" TEXT NOT NULL,
    "notes" TEXT,
    "delayed" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedDate" TIMESTAMP(3),
    "tabled" BOOLEAN NOT NULL DEFAULT false,
    "tabledDate" TIMESTAMP(3),
    "frameBuilt" BOOLEAN NOT NULL DEFAULT false,
    "frameBuiltDate" TIMESTAMP(3),
    "frameReceived" BOOLEAN NOT NULL DEFAULT false,
    "frameReceivedDate" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedDate" TIMESTAMP(3),
    "binLocation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FrameToOrder" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "frameSku" TEXT NOT NULL,
    "frameNotes" TEXT NOT NULL,
    "footage" DOUBLE PRECISION NOT NULL,
    "size" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "vendor" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'On List',
    "orderedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FrameToOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "FrameToOrder_orderId_key" ON "FrameToOrder"("orderId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrameToOrder" ADD CONSTRAINT "FrameToOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
