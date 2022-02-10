-- CreateTable
CREATE TABLE `PlaylistEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `played_on` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `song_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `artist` ON `Artist`(`name`, `aliases`);

-- AddForeignKey
ALTER TABLE `PlaylistEntry` ADD CONSTRAINT `fk_playlist_song` FOREIGN KEY (`song_id`) REFERENCES `Song`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
