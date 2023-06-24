-- AlterTable
ALTER TABLE "Chapter" ALTER COLUMN "order" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "order" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
