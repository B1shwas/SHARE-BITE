/*
  Warnings:

  - Added the required column `role` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "role" "ROLE" NOT NULL;
