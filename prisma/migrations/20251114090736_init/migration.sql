/*
  Warnings:

  - You are about to drop the column `shiftId` on the `IP` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."IP" DROP CONSTRAINT "IP_shiftId_fkey";

-- AlterTable
ALTER TABLE "public"."IP" DROP COLUMN "shiftId";

-- CreateTable
CREATE TABLE "public"."_ShiftIPs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ShiftIPs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ShiftIPs_B_index" ON "public"."_ShiftIPs"("B");

-- AddForeignKey
ALTER TABLE "public"."_ShiftIPs" ADD CONSTRAINT "_ShiftIPs_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."IP"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ShiftIPs" ADD CONSTRAINT "_ShiftIPs_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Shift"("id") ON DELETE CASCADE ON UPDATE CASCADE;
