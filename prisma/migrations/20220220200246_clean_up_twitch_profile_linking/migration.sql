/*
  Warnings:

  - You are about to drop the column `user` on the `TwitchCredentials` table. All the data in the column will be lost.
  - Added the required column `twitch_id` to the `TwitchCredentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `TwitchCredentials` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `TwitchCredentials` DROP FOREIGN KEY `fk_user_token`;

-- DropForeignKey
ALTER TABLE `TwitchUserProfile` DROP FOREIGN KEY `fk_user_to_twitch`;

-- AlterTable
ALTER TABLE `TwitchCredentials` DROP COLUMN `user`,
    ADD COLUMN `date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `twitch_id` INTEGER NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `TwitchUserProfile` ADD CONSTRAINT `TwitchUserProfile_user_fkey` FOREIGN KEY (`user`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `TwitchCredentials` ADD CONSTRAINT `TwitchCredentials_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `TwitchCredentials` ADD CONSTRAINT `TwitchCredentials_twitch_id_fkey` FOREIGN KEY (`twitch_id`) REFERENCES `TwitchUserProfile`(`user`) ON DELETE RESTRICT ON UPDATE CASCADE;
