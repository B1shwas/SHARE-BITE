/*
  Warnings:

  - Added the required column `updatedAt` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DONATION_POST_STATUS" AS ENUM ('PENDING', 'RESERVED', 'COMPLETED', 'EXPIRED', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "DONATION_REQUEST_STATUS" AS ENUM ('ACCEPTED', 'REJECTED', 'CANCELLED', 'PENDING');

-- CreateEnum
CREATE TYPE "FOOD_CATEGORY" AS ENUM ('GRAINS_AND_CEREALS', 'FRUITS_AND_VEGETABLES', 'DAIRY_PRODUCTS', 'MEAT_AND_POULTRY', 'CANNED_AND_PACKAGED', 'BEVERAGES', 'SNACKS_AND_SWEETS', 'BABY_FOOD', 'BAKED_GOODS', 'PLANT_BASED', 'COOKED_MEALS', 'OTHER');

-- CreateEnum
CREATE TYPE "SOCIAL_HANDLE" AS ENUM ('FACEBOOK', 'INSTAGRAM', 'TWITTER', 'LINKEDIN', 'MEDIUM');

-- CreateEnum
CREATE TYPE "USER_TYPE" AS ENUM ('INDIVIDUAL', 'ORGANIZATION');

-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "usertype" "USER_TYPE" NOT NULL DEFAULT 'ORGANIZATION';

-- CreateTable
CREATE TABLE "Individual" (
    "user_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "bio" TEXT,
    "profile" TEXT,
    "gender" "GENDER",
    "dob" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Individual_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "bio" TEXT,
    "profile" TEXT,
    "website" TEXT,
    "foundedAt" TIMESTAMP(3),
    "isNgo" BOOLEAN NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Social" (
    "id" TEXT NOT NULL,
    "orgId" TEXT,
    "individualId" TEXT,
    "platform" "SOCIAL_HANDLE" NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donor" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "individualId" TEXT NOT NULL,
    "maxStorage" INTEGER,
    "preferredFood" "FOOD_CATEGORY"[],

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receiver" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "individualId" TEXT NOT NULL,
    "preferredFood" "FOOD_CATEGORY"[],
    "hasFrozenStore" BOOLEAN NOT NULL,
    "receivingHours" JSONB NOT NULL,

    CONSTRAINT "Receiver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonationPost" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photos" TEXT[],
    "pickupLocation" TEXT,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "urgentPickup" BOOLEAN,
    "status" "DONATION_POST_STATUS" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "DonationPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonationRequest" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "DONATION_REQUEST_STATUS" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "DonationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_orgId_key" ON "Donor"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_individualId_key" ON "Donor"("individualId");

-- CreateIndex
CREATE UNIQUE INDEX "Receiver_orgId_key" ON "Receiver"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Receiver_individualId_key" ON "Receiver"("individualId");

-- AddForeignKey
ALTER TABLE "Individual" ADD CONSTRAINT "Individual_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_individualId_fkey" FOREIGN KEY ("individualId") REFERENCES "Individual"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_individualId_fkey" FOREIGN KEY ("individualId") REFERENCES "Individual"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receiver" ADD CONSTRAINT "Receiver_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receiver" ADD CONSTRAINT "Receiver_individualId_fkey" FOREIGN KEY ("individualId") REFERENCES "Individual"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationPost" ADD CONSTRAINT "DonationPost_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationRequest" ADD CONSTRAINT "DonationRequest_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "DonationPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationRequest" ADD CONSTRAINT "DonationRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Receiver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
