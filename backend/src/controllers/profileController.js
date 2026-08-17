const prisma = require("../../prismaClient");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { calculateBMI, calculateBMR, calculateTDEE } = require("../utils/helper");

const createOrUpdateProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { height, weight, age, gender, sport, fitnessLevel } = req.body;

  //validate the data coming from user
  if (!height || !weight || !age || !gender || !sport || !fitnessLevel) {
    return next(new AppError("Please provide all required fields", 400));
  }

  //calculate matrix
  const bmi = calculateBMI(weight, height);
  const bmr = calculateBMR(weight, height, gender, age);
  const tdee = calculateTDEE(bmr, fitnessLevel);

  //check if profile already exists
  const existingProfile = await prisma.Profile.findUnique({
    where: { userId },
  });

  let profile;

  if (existingProfile) {
    profile = await prisma.Profile.update({
      where: { userId },
      data: {
        height,
        weight,
        age,
        gender,
        fitnessLevel,
        sport,
        bmi,
        bmr,
        tdee,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } else {
    profile = await prisma.Profile.create({
      data: {
        userId,
        height,
        weight,
        age,
        gender,
        fitnessLevel,
        sport,
        bmi,
        bmr,
        tdee,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: profile,
    });
  }

  if (!profile) {
    return next(new AppError("Error saving profile", 500));
  }
});

const getProfile = catchAsync(async (req, res, next) => {
  const profile = await prisma.Profile.findUnique({
    where: {
      userId: req.user.id,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!profile) {
    return next(new AppError("Profile not found please complete you profile", 404));
  }

  return res.status(200).json({ success: true, data: profile });
});

const updateProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const updates = req.body;

  const existing = await prisma.Profile.findUnique({
    where: { userId },
  });

  if (!existing) {
    return next(new AppError("Profile not found please complete you profile", 404));
  }

  const updatedData = {
    ...existing,
    ...updates,
  };

  // Step 4: Recalculate if needed
  let bmi = existing.bmi;
  let bmr = existing.bmr;
  let tdee = existing.tdee;

  if (updates.weight || updates.height) {
    bmi = calculateBMI(updates.weight || existing.weight, updates.height || existing.height);
  }

  if (updates.weight || updates.height || updates.age || updates.gender) {
    bmr = calculateBMR(
      updates.weight || existing.weight,
      updates.height || existing.height,
      updates.gender || existing.gender,
      updates.age || existing.age,
    );
    tdee = calculateTDEE(bmr, updates.fitnessLevel || existing.fitnessLevel);
  }

  const profile = await prisma.Profile.update({
    where: { userId },
    data: {
      ...updates,
      bmi,
      bmr,
      tdee,
      updatedAt: new Date(),
    },
  });

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: profile,
  });
});
module.exports = { createOrUpdateProfile, getProfile, updateProfile };
