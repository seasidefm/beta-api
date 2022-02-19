/*
  Warnings:

  - You are about to drop the column `status` on the `RequestMeta` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `RequestMeta` DROP COLUMN `status`,
    ADD COLUMN `ownedStatus` BOOLEAN NOT NULL DEFAULT false;
