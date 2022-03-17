/*
  Warnings:

  - You are about to drop the column `testField` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Formation" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "testField";
