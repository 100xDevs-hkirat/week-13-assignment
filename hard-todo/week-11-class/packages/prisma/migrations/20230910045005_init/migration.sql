-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "purchasedCourses" INTEGER[];
