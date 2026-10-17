const prisma = require("../../prismaClient");
const { catchAsync } = require("../utils/catchAsync");

// GET /api/progress
exports.getProgressAnalytics = catchAsync(async (req, res) => {
  const userId = req.user.id;

  // Fetch this athlete's saved workout plans and exercises.
  const [totalWorkouts, exercises] = await Promise.all([
    prisma.WorkoutPlan.count({
      where: { userId },
    }),

    prisma.WorkoutPlanExercise.findMany({
      where: {
        plan: { userId },
      },
      select: {
        completed: true,
        completedAt: true,
      },
    }),
  ]);

  const totalExercises = exercises.length;
  const completedExercises = exercises.filter((exercise) => exercise.completed).length;
  const pendingExercises = totalExercises - completedExercises;

  const completionRate =
    totalExercises === 0 ? 0 : Math.round((completedExercises / totalExercises) * 100);

  // Prepare the last seven calendar days, including today.
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const weeklyActivity = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - i);

    const dateKey = date.toISOString().slice(0, 10);

    const completedCount = exercises.filter((exercise) => {
      if (!exercise.completed || !exercise.completedAt) {
        return false;
      }

      return new Date(exercise.completedAt).toISOString().slice(0, 10) === dateKey;
    }).length;

    weeklyActivity.push({
      date: dateKey,
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: "UTC",
      }),
      completed: completedCount,
    });
  }

  const activeDays = weeklyActivity.filter((day) => day.completed > 0).length;

  res.status(200).json({
    status: "success",
    data: {
      summary: {
        totalWorkouts,
        totalExercises,
        completedExercises,
        pendingExercises,
        completionRate,
        activeDaysLast7Days: activeDays,
      },
      completionBreakdown: [
        { name: "Completed", value: completedExercises },
        { name: "Pending", value: pendingExercises },
      ],
      weeklyActivity,
    },
  });
});
