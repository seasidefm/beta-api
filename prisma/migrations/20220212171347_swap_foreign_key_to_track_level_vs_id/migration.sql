-- DropForeignKey
ALTER TABLE `UserExperience` DROP FOREIGN KEY `UserExperience_level_fkey`;

-- AlterTable
ALTER TABLE `UserExperience` MODIFY `level` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `UserExperience` ADD CONSTRAINT `UserExperience_level_fkey` FOREIGN KEY (`level`) REFERENCES `ExperienceLevel`(`level`) ON DELETE RESTRICT ON UPDATE CASCADE;
