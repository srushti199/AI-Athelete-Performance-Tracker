const prisma = require("../../prismaClient");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const onBoardingStep1 = catchAsync(async (req, res, next) => {
  const { age, gender, height, weight } = req.body;

  const profile = await prisma.AthleteProfile.create({
    data: {
      userId: req.user.id,
      age: parseInt(age),
      gender,
      heightCm: parseFloat(height),
      weightKg: parseFloat(weight),
      onboardingStep: 1,
    },
  });

  res.status(201).json({
    message: "Step 1 completed",
    profile,
  });
});

const onBoardingStep2 = catchAsync(async (req, res, next) => {
  const { sport, activityLevel, competitionLevel } = req.body;

  const profile = await prisma.AthleteProfile.update({
    where: {
      userId: req.user.id,
    },
    data: {
      sport,
      activityLevel,
      competitionLevel,
      onboardingStep: 2,
    },
  });

  res.status(200).json({
    message: "Step 2 completed",
    profile,
  });
});

const onBoardingStep3 = catchAsync(async (req, res, next) => {
  const { injury } = req.body;

  const profile = await prisma.AthleteProfile.findUnique({
    where: {
      userId: req.user.id,
    },
  });

  if (!profile) {
    return next(new AppError("Profile not exists", 404));
  }

  await prisma.$transaction(async (tx) => {
    if (injury) {
      await tx.Injury.create({
        data: {
          athleteId: profile.id,
          injuryName: injury.injuryName,
          bodyRegion: injury.bodyRegion,
          severity: injury.severity,
        },
      });
    }

    await tx.AthleteProfile.update({
      where: {
        id: profile.id,
      },
      data: {
        onboardingStep: 3,
        onboardingCompletedAt: new Date(),
      },
    });
  });

  res.status(200).json({
    message: "Onboarding completed successfully",
  });
});

module.exports = {
  onBoardingStep1,
  onBoardingStep2,
  onBoardingStep3,
};
