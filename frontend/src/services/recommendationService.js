import api from "../api/axios";

// Accept either a single value or an array of values.
const toArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter((item) => item !== null && item !== undefined && item !== "");
  }

  if (value === null || value === undefined || value === "") {
    return [];
  }

  return [value];
};

export const getRecommendations = async (preferences) => {
  const equipmentOptions = toArray(preferences.equipment);
  const bodyParts = toArray(preferences.bodyParts ?? preferences.bodyPart);
  const targets = toArray(preferences.targets ?? preferences.target);
  const categories = toArray(preferences.categories ?? preferences.category);

  const difficulty = preferences.difficulty || "Beginner";

  // Keep the existing scalar fields so the current backend
  // continues to work while we upgrade the remaining layers.
  const payload = {
    equipment: equipmentOptions[0] || "",
    bodyPart: bodyParts[0] || "",
    target: targets[0] || "",
    difficulty,
    category: categories[0] || "",
    description: preferences.description || "",
    top_n: preferences.top_n || 10,
    excluded_exercises: preferences.excluded_exercises || [],

    // New fields for the upcoming multi-preference support.
    equipment_options: equipmentOptions,
    body_parts: bodyParts,
    targets,
    categories,
  };

  const response = await api.post("/recommendations", payload);

  return response.data.data;
};
