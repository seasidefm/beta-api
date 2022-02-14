-- CreateTable
CREATE TABLE `TwitchUserProfile` (
    `user` INTEGER NOT NULL,
    `twitch_id` INTEGER NOT NULL,
    `login` VARCHAR(191) NOT NULL,
    `display_name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `broadcaster_type` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `profile_image_url` VARCHAR(191) NOT NULL,
    `offline_image_url` VARCHAR(191) NOT NULL,
    `view_count` INTEGER NOT NULL,
    `created_at` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `TwitchUserProfile_user_key`(`user`),
    UNIQUE INDEX `TwitchUserProfile_twitch_id_key`(`twitch_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TwitchUserProfile` ADD CONSTRAINT `fk_user_to_twitch` FOREIGN KEY (`user`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
