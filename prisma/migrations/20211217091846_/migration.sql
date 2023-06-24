/*
  Warnings:

  - A unique constraint covering the columns `[notionPageId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[notionPageId]` on the table `CourseContent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[notionPageId]` on the table `Formation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Course_notionPageId_key" ON "Course"("notionPageId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseContent_notionPageId_key" ON "CourseContent"("notionPageId");

-- CreateIndex
CREATE UNIQUE INDEX "Formation_notionPageId_key" ON "Formation"("notionPageId");
