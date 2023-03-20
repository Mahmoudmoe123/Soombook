/*
  Warnings:

  - The `departureDate` column on the `Trip` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `arrivalDate` column on the `Trip` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "departureDate",
ADD COLUMN     "departureDate" TIMESTAMP(3),
DROP COLUMN "arrivalDate",
ADD COLUMN     "arrivalDate" TIMESTAMP(3);
