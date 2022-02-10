-- AlterTable
ALTER TABLE `PlaylistEntry` ADD COLUMN `playing` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `current_song` ON `PlaylistEntry`(`playing`, `song_id`);
