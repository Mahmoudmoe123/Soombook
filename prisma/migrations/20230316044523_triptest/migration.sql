/*
  Warnings:

  - You are about to drop the column `userId` on the `Trip` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_userId_fkey";

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "userId";
