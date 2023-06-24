-- AlterTable
ALTER TABLE "Chapter" ALTER COLUMN "duration" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "duration" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Lesson" ALTER COLUMN "duration" DROP NOT NULL,
ALTER COLUMN "duration" SET DEFAULT 0;
