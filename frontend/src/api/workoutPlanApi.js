import api from "./axios";

// Save a workout plan with its selected exercises
export const createWorkoutPlan = async (planData) => {
  const response = await api.post("/workout-plans", planData);
  return response.data;
};

// Fetch all workout plans belonging to the logged-in athlete
export const getWorkoutPlans = async () => {
  const response = await api.get("/workout-plans");
  return response.data;
};

// Fetch a specific workout plan by its ID
export const getWorkoutPlan = async (planId) => {
  const response = await api.get(`/workout-plans/${planId}`);
  return response.data;
};

// Update an exercise's completion status
export const updateExerciseCompletion = async (planId, exerciseId, completed) => {
  const response = await api.patch(`/workout-plans/${planId}/exercises/${exerciseId}/complete`, {
    completed,
  });

  return response.data;
};
