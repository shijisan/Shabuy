/*
  Warnings:

  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `UserRole` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `userrole` DROP FOREIGN KEY `UserRole_roleId_fkey`;

-- AlterTable
ALTER TABLE `userrole` ADD COLUMN `role` ENUM('USER', 'SELLER', 'ADMIN') NOT NULL;

-- DropTable
DROP TABLE `role`;
