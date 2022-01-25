/*
  Warnings:

  - You are about to drop the column `difficultyId` on the `Formation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Formation" DROP CONSTRAINT "Formation_difficultyId_fkey";

-- AlterTable
ALTER TABLE "Formation" DROP COLUMN "difficultyId",
ADD COLUMN     "diffiultyId" INTEGER;

-- CreateTable
CREATE TABLE "_FormationToTechnology" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FormationToTechnology_AB_unique" ON "_FormationToTechnology"("A", "B");

-- CreateIndex
CREATE INDEX "_FormationToTechnology_B_index" ON "_FormationToTechnology"("B");

-- AddForeignKey
ALTER TABLE "Formation" ADD CONSTRAINT "Formation_diffiultyId_fkey" FOREIGN KEY ("diffiultyId") REFERENCES "Difficulty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormationToTechnology" ADD FOREIGN KEY ("A") REFERENCES "Formation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormationToTechnology" ADD FOREIGN KEY ("B") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
