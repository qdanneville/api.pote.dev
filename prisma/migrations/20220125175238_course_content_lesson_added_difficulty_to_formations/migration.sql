/*
  Warnings:

  - You are about to drop the column `courseContentId` on the `ChapterStep` table. All the data in the column will be lost.
  - You are about to drop the `CourseContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseProgression` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lessonId` to the `ChapterStep` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChapterStep" DROP CONSTRAINT "ChapterStep_courseContentId_fkey";

-- DropForeignKey
ALTER TABLE "CourseProgression" DROP CONSTRAINT "CourseProgression_chapterStepId_fkey";

-- DropForeignKey
ALTER TABLE "CourseProgression" DROP CONSTRAINT "CourseProgression_userId_fkey";

-- AlterTable
ALTER TABLE "ChapterStep" DROP COLUMN "courseContentId",
ADD COLUMN     "lessonId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Formation" ADD COLUMN     "difficultyId" INTEGER;

-- DropTable
DROP TABLE "CourseContent";

-- DropTable
DROP TABLE "CourseProgression";

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "notionPageId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonProgression" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "chapterStepId" INTEGER NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonProgression_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_slug_key" ON "Lesson"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_notionPageId_key" ON "Lesson"("notionPageId");

-- AddForeignKey
ALTER TABLE "ChapterStep" ADD CONSTRAINT "ChapterStep_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Formation" ADD CONSTRAINT "Formation_difficultyId_fkey" FOREIGN KEY ("difficultyId") REFERENCES "Difficulty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgression" ADD CONSTRAINT "LessonProgression_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgression" ADD CONSTRAINT "LessonProgression_chapterStepId_fkey" FOREIGN KEY ("chapterStepId") REFERENCES "ChapterStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
