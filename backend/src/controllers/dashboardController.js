const prisma = require("../../prismaClient");
const { catchAsync } = require("../utils/catchAsync");

exports.getDashboard = catchAsync(async (req, res) => {
  const userId = req.user.id;

  // Fetch the logged-in athlete
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profile: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "Athlete not found",
    });
  }

  // Count workout plans created by this athlete
  const totalWorkouts = await prisma.workoutPlan.count({
    where: { userId },
  });

  // Fetch exercise completion records belonging to this athlete
  const exercises = await prisma.workoutPlanExercise.findMany({
    where: {
      plan: {
        userId,
      },
    },
    select: {
      completed: true,
    },
  });

  const totalExercises = exercises.length;

  const completedExercises = exercises.filter((exercise) => exercise.completed).length;

  const pendingExercises = totalExercises - completedExercises;

  const completionRate =
    totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  res.status(200).json({
    status: "success",
    data: {
      athlete: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileExists: Boolean(user.profile),
      },
      stats: {
        totalWorkouts,
        totalExercises,
        completedExercises,
        pendingExercises,
        completionRate,
      },
    },
  });
});
