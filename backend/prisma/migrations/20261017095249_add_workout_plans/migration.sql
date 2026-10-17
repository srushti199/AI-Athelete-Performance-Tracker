-- CreateTable
CREATE TABLE `WorkoutPlan` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `WorkoutPlan_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkoutPlanExercise` (
    `id` VARCHAR(191) NOT NULL,
    `planId` VARCHAR(191) NOT NULL,
    `exerciseName` VARCHAR(191) NOT NULL,
    `equipment` VARCHAR(191) NULL,
    `bodyPart` VARCHAR(191) NULL,
    `target` VARCHAR(191) NULL,
    `difficulty` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `dayOfWeek` VARCHAR(191) NULL,
    `scheduledDate` DATETIME(3) NULL,
    `sets` INTEGER NOT NULL DEFAULT 3,
    `reps` VARCHAR(191) NOT NULL DEFAULT '10-12',
    `restSeconds` INTEGER NOT NULL DEFAULT 60,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `WorkoutPlanExercise_planId_idx`(`planId`),
    INDEX `WorkoutPlanExercise_scheduledDate_idx`(`scheduledDate`),
    INDEX `WorkoutPlanExercise_planId_completed_idx`(`planId`, `completed`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkoutPlan` ADD CONSTRAINT `WorkoutPlan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutPlanExercise` ADD CONSTRAINT `WorkoutPlanExercise_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `WorkoutPlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
