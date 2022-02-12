-- CreateTable
CREATE TABLE `MachineUser` (
    `clientId` VARCHAR(191) NOT NULL,
    `clientSecret` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `MachineUser_name_key`(`name`),
    PRIMARY KEY (`clientId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MachineKey` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL,
    `lastUsed` DATETIME(3) NULL,
    `machineUserClientId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MachineKey` ADD CONSTRAINT `MachineKey_machineUserClientId_fkey` FOREIGN KEY (`machineUserClientId`) REFERENCES `MachineUser`(`clientId`) ON DELETE SET NULL ON UPDATE CASCADE;
