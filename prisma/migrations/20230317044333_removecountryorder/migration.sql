/*
  Warnings:

  - Made the column `originCountry` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `destinationCountry` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "originCountry" SET NOT NULL,
ALTER COLUMN "destinationCountry" SET NOT NULL;
