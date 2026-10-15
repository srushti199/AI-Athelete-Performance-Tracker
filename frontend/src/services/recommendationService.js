import api from "../api/axios";

export const getRecommendations = async (preferences) => {
  const response = await api.post("/recommendations", {
    equipment: preferences.equipment,
    bodyPart: preferences.bodyPart,
    target: preferences.target,
    difficulty: preferences.difficulty,
    category: preferences.category,
    description: preferences.description || "",
    top_n: preferences.top_n || 10,
    excluded_exercises: preferences.excluded_exercises || [],
  });

  return response.data.data;
};
