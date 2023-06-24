/*
  Warnings:

  - You are about to drop the column `confirmed` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "confirmed",
DROP COLUMN "firstname",
DROP COLUMN "lastname",
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;
