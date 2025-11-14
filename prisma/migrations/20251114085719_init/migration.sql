-- DropForeignKey
ALTER TABLE "public"."IP" DROP CONSTRAINT "IP_shiftId_fkey";

-- AlterTable
ALTER TABLE "public"."IP" ALTER COLUMN "shiftId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."IP" ADD CONSTRAINT "IP_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "public"."Shift"("id") ON DELETE SET NULL ON UPDATE CASCADE;
