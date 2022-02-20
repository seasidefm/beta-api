-- DropForeignKey
ALTER TABLE `TwitchCredentials` DROP FOREIGN KEY `TwitchCredentials_twitch_id_fkey`;

-- AlterTable
ALTER TABLE `TwitchCredentials` MODIFY `twitch_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `TwitchUserProfile` MODIFY `twitch_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `TwitchCredentials` ADD CONSTRAINT `TwitchCredentials_twitch_id_fkey` FOREIGN KEY (`twitch_id`) REFERENCES `TwitchUserProfile`(`twitch_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
