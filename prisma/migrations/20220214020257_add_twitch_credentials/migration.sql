/*
  Warnings:

  - You are about to drop the `MachineKey` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `clientSecret` on table `MachineUser` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `MachineKey` DROP FOREIGN KEY `MachineKey_machineUserClientId_fkey`;

-- AlterTable
ALTER TABLE `MachineUser` MODIFY `clientSecret` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `MachineKey`;

-- CreateTable
CREATE TABLE `TwitchCredentials` (
    `user` INTEGER NOT NULL,
    `platform_token` VARCHAR(191) NOT NULL,
    `access_token` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191) NOT NULL,
    `scope` VARCHAR(191) NULL,
    `token_type` VARCHAR(191) NOT NULL DEFAULT 'bearer',

    UNIQUE INDEX `TwitchCredentials_user_key`(`user`),
    UNIQUE INDEX `TwitchCredentials_platform_token_key`(`platform_token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Request` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `song` VARCHAR(191) NOT NULL,
    `artist` VARCHAR(191) NOT NULL,
    `dateRequested` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `datePlayed` DATETIME(3) NULL,
    `user` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TwitchCredentials` ADD CONSTRAINT `fk_user_token` FOREIGN KEY (`user`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `fk_user_request` FOREIGN KEY (`user`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
