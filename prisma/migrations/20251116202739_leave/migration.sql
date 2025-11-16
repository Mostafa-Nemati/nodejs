-- CreateEnum
CREATE TYPE "public"."LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."LeaveType" AS ENUM ('ANNUAL', 'SICK', 'UNPAID', 'PERSONAL');

-- CreateTable
CREATE TABLE "public"."LeaveRquest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "type" "public"."LeaveType",
    "status" "public"."LeaveStatus" NOT NULL,
    "approvedBy" INTEGER,
    "approvedDate" TIMESTAMP(3),
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeaveRquest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."LeaveRquest" ADD CONSTRAINT "LeaveRquest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
