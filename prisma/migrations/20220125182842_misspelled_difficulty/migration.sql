/*
  Warnings:

  - You are about to drop the column `diffiultyId` on the `Formation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Formation" DROP CONSTRAINT "Formation_diffiultyId_fkey";

-- AlterTable
ALTER TABLE "Formation" DROP COLUMN "diffiultyId",
ADD COLUMN     "difficultyId" INTEGER;

-- AddForeignKey
ALTER TABLE "Formation" ADD CONSTRAINT "Formation_difficultyId_fkey" FOREIGN KEY ("difficultyId") REFERENCES "Difficulty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
