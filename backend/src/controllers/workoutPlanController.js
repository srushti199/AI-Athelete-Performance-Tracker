const prisma = require("../../prismaClient");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// POST /api/workout-plans
exports.createWorkoutPlan = catchAsync(async (req, res, next) => {
  const { name, description, exercises } = req.body;

  if (typeof name !== "string" || !name.trim()) {
    return next(new AppError("Please provide a workout plan name.", 400));
  }

  if (!Array.isArray(exercises) || exercises.length === 0) {
    return next(new AppError("Please select at least one exercise for your plan.", 400));
  }

  const validExercises = [];

  for (const exercise of exercises) {
    if (!exercise || typeof exercise.name !== "string" || !exercise.name.trim()) {
      return next(new AppError("Every exercise must have a valid name.", 400));
    }

    const sets = exercise.sets === undefined ? 3 : Number(exercise.sets);
    const restSeconds = exercise.restSeconds === undefined ? 60 : Number(exercise.restSeconds);

    if (!Number.isInteger(sets) || sets < 1 || sets > 20) {
      return next(new AppError("Sets must be between 1 and 20.", 400));
    }

    if (!Number.isInteger(restSeconds) || restSeconds < 0 || restSeconds > 3600) {
      return next(new AppError("Rest time must be between 0 and 3600 seconds.", 400));
    }

    const optionalText = (value) =>
      typeof value === "string" && value.trim() ? value.trim() : null;

    validExercises.push({
      exerciseName: exercise.name.trim(),
      equipment: optionalText(exercise.equipment),
      bodyPart: optionalText(exercise.bodyPart),
      target: optionalText(exercise.target),
      difficulty: optionalText(exercise.difficulty),
      category: optionalText(exercise.category),
      dayOfWeek: optionalText(exercise.dayOfWeek),
      sets,
      reps:
        exercise.reps === undefined || exercise.reps === ""
          ? "10-12"
          : String(exercise.reps).trim(),
      restSeconds,
    });
  }

  const plan = await prisma.WorkoutPlan.create({
    data: {
      userId: req.user.id,
      name: name.trim(),
      description:
        typeof description === "string" && description.trim() ? description.trim() : null,
      exercises: {
        create: validExercises,
      },
    },
    include: {
      exercises: true,
    },
  });

  return res.status(201).json({
    status: "success",
    message: "Workout plan created successfully.",
    data: { plan },
  });
});

// GET /api/workout-plans
exports.getWorkoutPlans = catchAsync(async (req, res) => {
  const plans = await prisma.WorkoutPlan.findMany({
    where: { userId: req.user.id },
    include: { exercises: true },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json({
    status: "success",
    results: plans.length,
    data: { plans },
  });
});

// GET /api/workout-plans/:id
exports.getWorkoutPlan = catchAsync(async (req, res, next) => {
  const plan = await prisma.WorkoutPlan.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
    include: { exercises: true },
  });

  if (!plan) {
    return next(new AppError("Workout plan not found.", 404));
  }

  return res.status(200).json({
    status: "success",
    data: { plan },
  });
});

// PATCH /api/workout-plans/:planId/exercises/:exerciseId/complete
exports.updateExerciseCompletion = catchAsync(async (req, res, next) => {
  const { planId, exerciseId } = req.params;
  const { completed } = req.body;

  if (typeof completed !== "boolean") {
    return next(new AppError("Please provide completed as true or false.", 400));
  }

  // Verify that this plan belongs to the logged-in athlete.
  const plan = await prisma.WorkoutPlan.findFirst({
    where: {
      id: planId,
      userId: req.user.id,
    },
    select: { id: true },
  });

  if (!plan) {
    return next(new AppError("Workout plan not found.", 404));
  }

  // Verify that the exercise belongs to this plan.
  const exercise = await prisma.WorkoutPlanExercise.findFirst({
    where: {
      id: exerciseId,
      planId: plan.id,
    },
  });

  if (!exercise) {
    return next(new AppError("Exercise not found in this workout plan.", 404));
  }

  const updatedExercise = await prisma.WorkoutPlanExercise.update({
    where: { id: exerciseId },
    data: {
      completed,
      completedAt: completed ? new Date() : null,
    },
  });

  return res.status(200).json({
    status: "success",
    message: completed ? "Exercise marked as completed." : "Exercise marked as incomplete.",
    data: { exercise: updatedExercise },
  });
});
