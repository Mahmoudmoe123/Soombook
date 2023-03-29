-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "arrivalDate" TIMESTAMP(3),
ADD COLUMN     "tripId" INTEGER;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;
