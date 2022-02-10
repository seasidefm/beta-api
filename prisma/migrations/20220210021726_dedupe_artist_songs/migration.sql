/*
  Warnings:

  - A unique constraint covering the columns `[song_title,artist_id]` on the table `Song` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Song_song_title_artist_id_key` ON `Song`(`song_title`, `artist_id`);
