/*
  Warnings:

  - Added the required column `duration` to the `LeaveRquest` table without a default value. This is not possible if the table is not empty.
  - Made the column `type` on table `LeaveRquest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `LeaveRquest` ADD COLUMN `duration` VARCHAR(191) NOT NULL,
    MODIFY `reason` VARCHAR(191) NULL,
    MODIFY `type` ENUM('HOURLY', 'DAILY') NOT NULL;
