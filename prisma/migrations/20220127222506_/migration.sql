-- AlterTable
ALTER TABLE "Chapter" ALTER COLUMN "duration" DROP NOT NULL,
ALTER COLUMN "duration" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "duration" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Lesson" ALTER COLUMN "duration" DROP DEFAULT;
