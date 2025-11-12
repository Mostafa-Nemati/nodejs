/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verifyCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `family` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "public"."Todo" DROP CONSTRAINT "Todo_authorId_fkey";

-- DropIndex
DROP INDEX "public"."User_email_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "email",
DROP COLUMN "isVerified",
DROP COLUMN "verifyCode",
ADD COLUMN     "family" TEXT NOT NULL,
ADD COLUMN     "nationalCode" TEXT,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."Todo";

-- DropEnum
DROP TYPE "public"."Priority";
