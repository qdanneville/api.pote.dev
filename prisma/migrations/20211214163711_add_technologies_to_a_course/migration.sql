/*
  Warnings:

  - You are about to drop the column `userId` on the `ChapterStep` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChapterStep" DROP CONSTRAINT "ChapterStep_userId_fkey";

-- AlterTable
ALTER TABLE "ChapterStep" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_CourseToTechnology" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToTechnology_AB_unique" ON "_CourseToTechnology"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToTechnology_B_index" ON "_CourseToTechnology"("B");

-- AddForeignKey
ALTER TABLE "_CourseToTechnology" ADD FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToTechnology" ADD FOREIGN KEY ("B") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
