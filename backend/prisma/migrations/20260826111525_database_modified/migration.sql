/*
  Warnings:

  - You are about to drop the column `createdAT` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `createdAT`,
    DROP COLUMN `role`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `profile`;

-- CreateTable
CREATE TABLE `AthleteProfile` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `sport` VARCHAR(191) NULL,
    `competitionLevel` VARCHAR(191) NULL,
    `activityLevel` VARCHAR(191) NULL,
    `age` INTEGER NULL,
    `gender` VARCHAR(191) NULL,
    `heightCm` DECIMAL(5, 1) NULL,
    `weightKg` DECIMAL(5, 1) NULL,
    `injuryHistory` TEXT NULL,
    `onboardingStep` INTEGER NOT NULL DEFAULT 0,
    `onboardingCompletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `AthleteProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProfileGoal` (
    `id` VARCHAR(191) NOT NULL,
    `athleteId` VARCHAR(191) NOT NULL,
    `goalKey` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ProfileGoal_athleteId_goalKey_key`(`athleteId`, `goalKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Injury` (
    `id` VARCHAR(191) NOT NULL,
    `athleteId` VARCHAR(191) NOT NULL,
    `injuryName` VARCHAR(191) NOT NULL,
    `bodyRegion` VARCHAR(191) NULL,
    `severity` VARCHAR(191) NOT NULL,
    `recoveryStatus` VARCHAR(191) NOT NULL DEFAULT 'OPEN',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AthleteProfile` ADD CONSTRAINT `AthleteProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfileGoal` ADD CONSTRAINT `ProfileGoal_athleteId_fkey` FOREIGN KEY (`athleteId`) REFERENCES `AthleteProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Injury` ADD CONSTRAINT `Injury_athleteId_fkey` FOREIGN KEY (`athleteId`) REFERENCES `AthleteProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
