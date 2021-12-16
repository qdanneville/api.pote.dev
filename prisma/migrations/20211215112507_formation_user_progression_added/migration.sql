-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "successfullUserId" TEXT,
ADD COLUMN     "tryingUserId" TEXT;

-- CreateTable
CREATE TABLE "CourseProgression" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "chapterStepId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseProgression_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_tryingUserId_fkey" FOREIGN KEY ("tryingUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_successfullUserId_fkey" FOREIGN KEY ("successfullUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseProgression" ADD CONSTRAINT "CourseProgression_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseProgression" ADD CONSTRAINT "CourseProgression_chapterStepId_fkey" FOREIGN KEY ("chapterStepId") REFERENCES "ChapterStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
