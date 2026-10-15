/*
  Warnings:

  - You are about to alter the column `gender` on the `athleteprofile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `athleteprofile` MODIFY `gender` ENUM('MALE', 'FEMALE', 'OTHER') NULL;

-- CreateTable
CREATE TABLE `WorkoutPreference` (
    `id` VARCHAR(191) NOT NULL,
    `athleteId` VARCHAR(191) NOT NULL,
    `difficulty` VARCHAR(191) NULL,
    `sessionDuration` INTEGER NULL,
    `workoutDescription` TEXT NULL,

    UNIQUE INDEX `WorkoutPreference_athleteId_key`(`athleteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AthleteEquipment` (
    `id` VARCHAR(191) NOT NULL,
    `preferenceId` VARCHAR(191) NOT NULL,
    `equipment` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AthleteEquipment_preferenceId_equipment_key`(`preferenceId`, `equipment`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AthleteWorkoutType` (
    `id` VARCHAR(191) NOT NULL,
    `preferenceId` VARCHAR(191) NOT NULL,
    `workoutType` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AthleteWorkoutType_preferenceId_workoutType_key`(`preferenceId`, `workoutType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AthleteTargetArea` (
    `id` VARCHAR(191) NOT NULL,
    `preferenceId` VARCHAR(191) NOT NULL,
    `targetArea` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AthleteTargetArea_preferenceId_targetArea_key`(`preferenceId`, `targetArea`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkoutPreference` ADD CONSTRAINT `WorkoutPreference_athleteId_fkey` FOREIGN KEY (`athleteId`) REFERENCES `AthleteProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AthleteEquipment` ADD CONSTRAINT `AthleteEquipment_preferenceId_fkey` FOREIGN KEY (`preferenceId`) REFERENCES `WorkoutPreference`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AthleteWorkoutType` ADD CONSTRAINT `AthleteWorkoutType_preferenceId_fkey` FOREIGN KEY (`preferenceId`) REFERENCES `WorkoutPreference`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AthleteTargetArea` ADD CONSTRAINT `AthleteTargetArea_preferenceId_fkey` FOREIGN KEY (`preferenceId`) REFERENCES `WorkoutPreference`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
