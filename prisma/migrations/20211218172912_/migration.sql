/*
  Warnings:

  - A unique constraint covering the columns `[notionPageId]` on the table `Difficulty` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[notionPageId]` on the table `Prerequisite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[notionPageId]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[notionPageId]` on the table `Technology` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `notionPageId` to the `Difficulty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notionPageId` to the `Prerequisite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notionPageId` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notionPageId` to the `Technology` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Difficulty" ADD COLUMN     "notionPageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Prerequisite" ADD COLUMN     "notionPageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "notionPageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Technology" ADD COLUMN     "notionPageId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Difficulty_notionPageId_key" ON "Difficulty"("notionPageId");

-- CreateIndex
CREATE UNIQUE INDEX "Prerequisite_notionPageId_key" ON "Prerequisite"("notionPageId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_notionPageId_key" ON "Tag"("notionPageId");

-- CreateIndex
CREATE UNIQUE INDEX "Technology_notionPageId_key" ON "Technology"("notionPageId");
