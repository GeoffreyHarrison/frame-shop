-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "builtAt" TIMESTAMP(3),
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "delayedStatus" TIMESTAMP(3),
ADD COLUMN     "mustHaveStatus" TIMESTAMP(3),
ADD COLUMN     "pickedUpAt" TIMESTAMP(3),
ADD COLUMN     "receivedAt" TIMESTAMP(3),
ADD COLUMN     "tabledAt" TIMESTAMP(3),
ADD COLUMN     "verifiedAt" TIMESTAMP(3);
