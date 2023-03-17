/*
  Warnings:

  - You are about to drop the `orderedProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "orderedProduct";

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "productUrl" TEXT NOT NULL,
    "originCountry" TEXT,
    "destinationCountry" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
