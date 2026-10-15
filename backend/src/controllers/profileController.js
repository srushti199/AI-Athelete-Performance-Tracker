const prisma = require("../../prismaClient");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Convert a string or array into an array of individual strings.
const toArray = (value) => {
  const values = Array.isArray(value) ? value.flat(Infinity) : [value];

  return [
    ...new Set(
      values
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
};

const toNumberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const getSessionDuration = (value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const duration = Number.parseInt(String(value), 10);
  return Number.isInteger(duration) && duration > 0 ? duration : null;
};

// GET /api/profile
exports.getProfile = catchAsync(async (req, res, next) => {
  const user = await prisma.User.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profile: {
        include: {
          profileGoals: true,
          injuries: true,
          workoutPreference: {
            include: {
              equipment: true,
              workoutTypes: true,
              targetAreas: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      profile: user.profile,
    },
  });
});

// PATCH /api/profile
exports.updateProfile = catchAsync(async (req, res, next) => {
  const {
    fullName,
    gender,
    height,
    weight,
    fitnessLevel,
    sport,
    competitionLevel,
    goals,
    primaryGoal,
    equipment,
    workoutType,
    difficulty,
    targetArea,
    sessionDuration,
    workoutDescription,
  } = req.body;

  // Normalize arrays before starting the transaction.
  const equipmentList = toArray(equipment);
  const workoutTypeList = toArray(workoutType);
  const targetAreaList = toArray(targetArea);

  const goalsList = [...new Set([...toArray(goals), ...toArray(primaryGoal)])];

  const duration = getSessionDuration(sessionDuration);

  const heightValue = toNumberOrNull(height);
  const weightValue = toNumberOrNull(weight);

  if (heightValue !== null && heightValue <= 0) {
    return next(new AppError("Height must be greater than zero.", 400));
  }

  if (weightValue !== null && weightValue <= 0) {
    return next(new AppError("Weight must be greater than zero.", 400));
  }

  const result = await prisma.$transaction(async (tx) => {
    // Find the athlete profile belonging to the logged-in user.
    const athlete = await tx.AthleteProfile.findUnique({
      where: { userId: req.user.id },
      include: { workoutPreference: true },
    });

    if (!athlete) {
      throw new AppError("Athlete profile not found. Complete profile setup first.", 404);
    }

    // Update the user's name when provided.
    if (typeof fullName === "string" && fullName.trim()) {
      const parts = fullName.trim().split(/\s+/);
      const firstName = parts.shift();
      const lastName = parts.join(" ");

      await tx.User.update({
        where: { id: req.user.id },
        data: { firstName, lastName },
      });
    }

    // Update athlete details.
    const athleteData = {};

    if (gender !== undefined && gender !== "") {
      const normalizedGender = String(gender).trim().toUpperCase().replace(/\s+/g, "_");

      const genderMap = {
        FEMALE: "FEMALE",
        MALE: "MALE",
        OTHER: "OTHER",
        PREFER_NOT_TO_SAY: "OTHER",
      };

      if (!genderMap[normalizedGender]) {
        throw new AppError("Invalid gender value.", 400);
      }

      athleteData.gender = genderMap[normalizedGender];
    }

    if (height !== undefined) {
      athleteData.heightCm = heightValue;
    }

    if (weight !== undefined) {
      athleteData.weightKg = weightValue;
    }

    if (fitnessLevel !== undefined) {
      athleteData.activityLevel = fitnessLevel || null;
    }

    if (sport !== undefined) {
      athleteData.sport = sport || null;
    }

    if (competitionLevel !== undefined) {
      athleteData.competitionLevel = competitionLevel || null;
    }

    if (Object.keys(athleteData).length > 0) {
      await tx.AthleteProfile.update({
        where: { id: athlete.id },
        data: athleteData,
      });
    }

    // Replace saved goals only when goal fields were sent.
    if (goals !== undefined || primaryGoal !== undefined) {
      await tx.ProfileGoal.deleteMany({
        where: { athleteId: athlete.id },
      });

      if (goalsList.length > 0) {
        await tx.ProfileGoal.createMany({
          data: goalsList.map((goalKey) => ({
            athleteId: athlete.id,
            goalKey,
          })),
        });
      }
    }

    // Create or update workout preferences.
    const preferenceData = {};

    if (difficulty !== undefined) {
      preferenceData.difficulty = difficulty || null;
    }

    if (sessionDuration !== undefined) {
      preferenceData.sessionDuration = duration;
    }

    if (workoutDescription !== undefined) {
      preferenceData.workoutDescription = workoutDescription || null;
    }

    let preference = athlete.workoutPreference;

    if (!preference) {
      preference = await tx.WorkoutPreference.create({
        data: {
          athleteId: athlete.id,
          ...preferenceData,
        },
      });
    } else if (Object.keys(preferenceData).length > 0) {
      preference = await tx.WorkoutPreference.update({
        where: { athleteId: athlete.id },
        data: preferenceData,
      });
    }

    // Replace equipment only if the request included that field.
    if (equipment !== undefined) {
      await tx.AthleteEquipment.deleteMany({
        where: { preferenceId: preference.id },
      });

      if (equipmentList.length > 0) {
        await tx.AthleteEquipment.createMany({
          data: equipmentList.map((item) => ({
            preferenceId: preference.id,
            equipment: item,
          })),
        });
      }
    }

    // Replace workout types only if the request included that field.
    if (workoutType !== undefined) {
      await tx.AthleteWorkoutType.deleteMany({
        where: { preferenceId: preference.id },
      });

      if (workoutTypeList.length > 0) {
        await tx.AthleteWorkoutType.createMany({
          data: workoutTypeList.map((item) => ({
            preferenceId: preference.id,
            workoutType: item,
          })),
        });
      }
    }

    // Replace target areas only if the request included that field.
    if (targetArea !== undefined) {
      await tx.AthleteTargetArea.deleteMany({
        where: { preferenceId: preference.id },
      });

      if (targetAreaList.length > 0) {
        await tx.AthleteTargetArea.createMany({
          data: targetAreaList.map((item) => ({
            preferenceId: preference.id,
            targetArea: item,
          })),
        });
      }
    }

    // Return the updated profile with its related records.
    return tx.User.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profile: {
          include: {
            profileGoals: true,
            injuries: true,
            workoutPreference: {
              include: {
                equipment: true,
                workoutTypes: true,
                targetAreas: true,
              },
            },
          },
        },
      },
    });
  });

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully.",
    data: {
      user: {
        id: result.id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
      },
      profile: result.profile,
    },
  });
});

// DELETE /api/profile/injuries/:injuryId
exports.deleteInjury = catchAsync(async (req, res, next) => {
  const { injuryId } = req.params;

  if (!injuryId) {
    return next(new AppError("Injury ID is required.", 400));
  }

  // Find the logged-in athlete's profile.
  const athlete = await prisma.AthleteProfile.findUnique({
    where: {
      userId: req.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!athlete) {
    return next(new AppError("Athlete profile not found.", 404));
  }

  // Restrict deletion to an injury belonging to this athlete.
  const injury = await prisma.Injury.findFirst({
    where: {
      id: injuryId,
      athleteId: athlete.id,
    },
    select: {
      id: true,
    },
  });

  if (!injury) {
    return next(new AppError("Injury record not found.", 404));
  }

  await prisma.Injury.delete({
    where: {
      id: injury.id,
    },
  });

  return res.status(200).json({
    status: "success",
    message: "Injury record deleted successfully.",
    data: null,
  });
});
