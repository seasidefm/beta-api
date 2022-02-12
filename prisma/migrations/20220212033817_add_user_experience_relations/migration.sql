/*
  Warnings:

  - You are about to drop the column `user` on the `UserExperience` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserExperience` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `UserExperience` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `UserExperience_user_key` ON `UserExperience`;

-- AlterTable
ALTER TABLE `UserExperience` DROP COLUMN `user`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `UserExperience_userId_key` ON `UserExperience`(`userId`);

-- AddForeignKey
ALTER TABLE `UserExperience` ADD CONSTRAINT `UserExperience_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
