const express = require("express");
const workoutPlanController = require("../controllers/workoutPlanController");

const router = express.Router();

// Create a workout plan
router.post("/", workoutPlanController.createWorkoutPlan);

// Get all workout plans for the logged-in user
router.get("/", workoutPlanController.getWorkoutPlans);

router.patch(
  "/:planId/exercises/:exerciseId/complete",
  workoutPlanController.updateExerciseCompletion,
);

// Get one workout plan by ID
router.get("/:id", workoutPlanController.getWorkoutPlan);

module.exports = router;
