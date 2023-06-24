/*
  Warnings:

  - You are about to drop the column `chapterStepId` on the `LessonProgression` table. All the data in the column will be lost.
  - You are about to drop the `ChapterStep` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lessonId` to the `LessonProgression` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChapterStep" DROP CONSTRAINT "ChapterStep_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "ChapterStep" DROP CONSTRAINT "ChapterStep_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "LessonProgression" DROP CONSTRAINT "LessonProgression_chapterStepId_fkey";

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "chapterId" TEXT;

-- AlterTable
ALTER TABLE "LessonProgression" DROP COLUMN "chapterStepId",
ADD COLUMN     "lessonId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ChapterStep";

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgression" ADD CONSTRAINT "LessonProgression_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
