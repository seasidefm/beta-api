/*
  Warnings:

  - You are about to alter the column `song_title` on the `Song` table. The data in that column could be lost. The data in that column will be cast from `VarChar(256)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Artist` MODIFY `aliases` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Song` MODIFY `song_title` VARCHAR(191) NOT NULL;
