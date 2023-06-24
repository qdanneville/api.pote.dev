-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_diffiultyId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_formationId_fkey";

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "duration" DROP NOT NULL,
ALTER COLUMN "formationId" DROP NOT NULL,
ALTER COLUMN "diffiultyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_diffiultyId_fkey" FOREIGN KEY ("diffiultyId") REFERENCES "Difficulty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
