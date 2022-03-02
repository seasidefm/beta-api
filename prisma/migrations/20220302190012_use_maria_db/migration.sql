-- CreateTable
CREATE TABLE `PlaylistEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `played_on` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `playing` BOOLEAN NOT NULL DEFAULT false,
    `song_id` INTEGER NOT NULL,

    INDEX `current_song`(`playing`, `song_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Artist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `aliases` VARCHAR(256) NULL,

    UNIQUE INDEX `Artist_name_key`(`name`),
    INDEX `artist`(`name`, `aliases`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Song` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `song_title` VARCHAR(191) NOT NULL,
    `artist_id` INTEGER NOT NULL,

    INDEX `fk_song_artist`(`artist_id`),
    UNIQUE INDEX `Song_song_title_artist_id_key`(`song_title`, `artist_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TwitchUserProfile` (
    `user` INTEGER NOT NULL,
    `twitch_id` VARCHAR(191) NOT NULL,
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

-- CreateTable
CREATE TABLE `TwitchCredentials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `twitch_id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `platform_token` VARCHAR(191) NOT NULL,
    `date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_used` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `access_token` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191) NOT NULL,
    `scope` VARCHAR(191) NULL,
    `token_type` VARCHAR(191) NOT NULL DEFAULT 'bearer',

    UNIQUE INDEX `TwitchCredentials_platform_token_key`(`platform_token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Favorite` (
    `song` INTEGER NOT NULL,
    `user` INTEGER NOT NULL,
    `dateSaved` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fk_user`(`user`),
    INDEX `user_songs`(`song`, `user`),
    UNIQUE INDEX `song`(`song`, `user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Request` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `song` VARCHAR(191) NOT NULL,
    `artist` VARCHAR(191) NOT NULL,
    `dateRequested` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `datePlayed` DATETIME(3) NULL,
    `user` INTEGER NOT NULL,
    `requestMetaRequestId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RequestMeta` (
    `requestId` INTEGER NOT NULL AUTO_INCREMENT,
    `ripped` BOOLEAN NOT NULL DEFAULT false,
    `streamed` BOOLEAN NOT NULL DEFAULT false,
    `ownedStatus` BOOLEAN NOT NULL DEFAULT false,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`requestId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExperienceLevel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `required_exp` INTEGER NOT NULL,

    UNIQUE INDEX `ExperienceLevel_level_key`(`level`),
    UNIQUE INDEX `ExperienceLevel_name_key`(`name`),
    UNIQUE INDEX `ExperienceLevel_required_exp_key`(`required_exp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserExperience` (
    `userId` INTEGER NOT NULL,
    `level` INTEGER NOT NULL DEFAULT 0,
    `total_experience` INTEGER NOT NULL,

    UNIQUE INDEX `UserExperience_userId_key`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MachineUser` (
    `name` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `clientSecret` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `MachineUser_name_key`(`name`),
    PRIMARY KEY (`clientId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlaylistEntry` ADD CONSTRAINT `fk_playlist_song` FOREIGN KEY (`song_id`) REFERENCES `Song`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Song` ADD CONSTRAINT `fk_song_artist` FOREIGN KEY (`artist_id`) REFERENCES `Artist`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `TwitchUserProfile` ADD CONSTRAINT `TwitchUserProfile_user_fkey` FOREIGN KEY (`user`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `TwitchCredentials` ADD CONSTRAINT `TwitchCredentials_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `TwitchCredentials` ADD CONSTRAINT `TwitchCredentials_twitch_id_fkey` FOREIGN KEY (`twitch_id`) REFERENCES `TwitchUserProfile`(`twitch_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `fk_song` FOREIGN KEY (`song`) REFERENCES `Song`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `fk_user` FOREIGN KEY (`user`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `fk_user_request` FOREIGN KEY (`user`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_requestMetaRequestId_fkey` FOREIGN KEY (`requestMetaRequestId`) REFERENCES `RequestMeta`(`requestId`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `UserExperience` ADD CONSTRAINT `UserExperience_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserExperience` ADD CONSTRAINT `UserExperience_level_fkey` FOREIGN KEY (`level`) REFERENCES `ExperienceLevel`(`level`) ON DELETE RESTRICT ON UPDATE CASCADE;
