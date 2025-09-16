/*
  Warnings:

  - You are about to drop the column `verfyCode` on the `User` table. All the data in the column will be lost.
  - Added the required column `verifyCode` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "verfyCode",
ADD COLUMN     "verifyCode" TEXT NOT NULL;
