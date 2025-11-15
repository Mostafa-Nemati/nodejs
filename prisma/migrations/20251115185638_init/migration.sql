/*
  Warnings:

  - You are about to drop the column `overtime` on the `AttendanceLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."AttendanceLog" DROP COLUMN "overtime",
ADD COLUMN     "delayTime" TEXT,
ADD COLUMN     "overTime" TEXT,
ALTER COLUMN "workedHours" SET DATA TYPE TEXT;
