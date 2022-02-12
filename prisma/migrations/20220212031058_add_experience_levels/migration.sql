-- CreateTable
CREATE TABLE `ExperienceLevel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `required_exp` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserExperience` (
    `user` INTEGER NOT NULL,
    `current_level` INTEGER NOT NULL DEFAULT 1,
    `total_experience` INTEGER NOT NULL,

    UNIQUE INDEX `UserExperience_user_key`(`user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
