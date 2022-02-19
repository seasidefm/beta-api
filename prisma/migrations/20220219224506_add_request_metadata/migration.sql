/*
  Warnings:

  - Added the required column `requestMetaRequestId` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Request` ADD COLUMN `requestMetaRequestId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `RequestMeta` (
    `requestId` INTEGER NOT NULL AUTO_INCREMENT,
    `ripped` BOOLEAN NOT NULL DEFAULT false,
    `streamed` BOOLEAN NOT NULL DEFAULT false,
    `status` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`requestId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_requestMetaRequestId_fkey` FOREIGN KEY (`requestMetaRequestId`) REFERENCES `RequestMeta`(`requestId`) ON DELETE CASCADE ON UPDATE RESTRICT;
