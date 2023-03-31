/*
  Warnings:

  - You are about to drop the column `deliveryId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Delivery` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_deliveryId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "deliveryId";

-- DropTable
DROP TABLE "Delivery";
