/*
  Warnings:

  - You are about to drop the column `current_level` on the `UserExperience` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[level]` on the table `ExperienceLevel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `ExperienceLevel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[required_exp]` on the table `ExperienceLevel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `UserExperience` DROP COLUMN `current_level`,
    ADD COLUMN `level` INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX `ExperienceLevel_level_key` ON `ExperienceLevel`(`level`);

-- CreateIndex
CREATE UNIQUE INDEX `ExperienceLevel_name_key` ON `ExperienceLevel`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `ExperienceLevel_required_exp_key` ON `ExperienceLevel`(`required_exp`);

-- AddForeignKey
ALTER TABLE `UserExperience` ADD CONSTRAINT `UserExperience_level_fkey` FOREIGN KEY (`level`) REFERENCES `ExperienceLevel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
