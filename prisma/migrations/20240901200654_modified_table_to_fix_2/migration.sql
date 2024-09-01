/*
  Warnings:

  - The primary key for the `userrole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `roleId` on the `userrole` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `UserRole_roleId_fkey` ON `userrole`;

-- AlterTable
ALTER TABLE `userrole` DROP PRIMARY KEY,
    DROP COLUMN `roleId`,
    ADD PRIMARY KEY (`userId`, `role`);
