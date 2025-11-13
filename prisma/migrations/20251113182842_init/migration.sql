-- AlterTable
ALTER TABLE "public"."AttendanceLog" ADD COLUMN     "ipAddress" TEXT;

-- AlterTable
ALTER TABLE "public"."MonthlySummary" ADD COLUMN     "totalHolidayWork" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "shiftId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "public"."Shift"("id") ON DELETE SET NULL ON UPDATE CASCADE;
