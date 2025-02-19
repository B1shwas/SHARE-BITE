/*
  Warnings:

  - You are about to drop the column `individualId` on the `Donor` table. All the data in the column will be lost.
  - You are about to drop the column `orgId` on the `Donor` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `individualId` on the `Receiver` table. All the data in the column will be lost.
  - You are about to drop the column `orgId` on the `Receiver` table. All the data in the column will be lost.
  - You are about to drop the column `individualId` on the `Social` table. All the data in the column will be lost.
  - You are about to drop the column `orgId` on the `Social` table. All the data in the column will be lost.
  - You are about to drop the column `usertype` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Donor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Receiver` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isVerified` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Receiver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Social` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Donor" DROP CONSTRAINT "Donor_individualId_fkey";

-- DropForeignKey
ALTER TABLE "Donor" DROP CONSTRAINT "Donor_orgId_fkey";

-- DropForeignKey
ALTER TABLE "Receiver" DROP CONSTRAINT "Receiver_individualId_fkey";

-- DropForeignKey
ALTER TABLE "Receiver" DROP CONSTRAINT "Receiver_orgId_fkey";

-- DropForeignKey
ALTER TABLE "Social" DROP CONSTRAINT "Social_individualId_fkey";

-- DropForeignKey
ALTER TABLE "Social" DROP CONSTRAINT "Social_orgId_fkey";

-- DropIndex
DROP INDEX "Donor_individualId_key";

-- DropIndex
DROP INDEX "Donor_orgId_key";

-- DropIndex
DROP INDEX "Receiver_individualId_key";

-- DropIndex
DROP INDEX "Receiver_orgId_key";

-- AlterTable
ALTER TABLE "DonationPost" ALTER COLUMN "urgentPickup" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Donor" DROP COLUMN "individualId",
DROP COLUMN "orgId",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Individual" ADD COLUMN     "donorId" TEXT;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "verified",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Receiver" DROP COLUMN "individualId",
DROP COLUMN "orgId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Social" DROP COLUMN "individualId",
DROP COLUMN "orgId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "usertype";

-- DropEnum
DROP TYPE "USER_TYPE";

-- CreateIndex
CREATE UNIQUE INDEX "Donor_userId_key" ON "Donor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Receiver_userId_key" ON "Receiver"("userId");

-- AddForeignKey
ALTER TABLE "Individual" ADD CONSTRAINT "Individual_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receiver" ADD CONSTRAINT "Receiver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
