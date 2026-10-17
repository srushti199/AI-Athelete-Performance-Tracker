const axios = require("axios");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8001";

// Accept either a single preference or an array of preferences.
const toArray = (value) => {
  const values = Array.isArray(value) ? value : [value];

  return values.filter((item) => item !== null && item !== undefined && String(item).trim() !== "");
};

exports.getRecommendations = catchAsync(async (req, res, next) => {
  const {
    equipment,
    equipment_options,
    bodyPart,
    body_parts,
    target,
    targets,
    difficulty,
    category,
    categories,
    description = "",
    top_n = 10,
    excluded_exercises = [],
  } = req.body;

  // Support both the old single-value format and the new array format.
  const equipmentOptions = toArray(equipment_options?.length ? equipment_options : equipment);

  const bodyParts = toArray(body_parts?.length ? body_parts : bodyPart);

  const targetOptions = toArray(targets?.length ? targets : target);

  const categoryOptions = toArray(categories?.length ? categories : category);

  // Validate required preferences.
  if (
    equipmentOptions.length === 0 ||
    bodyParts.length === 0 ||
    targetOptions.length === 0 ||
    categoryOptions.length === 0 ||
    !difficulty
  ) {
    return next(
      new AppError("Equipment, body part, target, difficulty, and category are required.", 400),
    );
  }

  // Keep the existing scalar fields for backward compatibility.
  // The ML service will be updated next to process the arrays.
  const payload = {
    equipment: equipmentOptions[0],
    bodyPart: bodyParts[0],
    target: targetOptions[0],
    difficulty,
    category: categoryOptions[0],
    description,
    top_n: Number(top_n) || 10,
    excluded_exercises: Array.isArray(excluded_exercises) ? excluded_exercises : [],

    // Multi-preference fields for the ML service.
    equipment_options: equipmentOptions,
    body_parts: bodyParts,
    targets: targetOptions,
    categories: categoryOptions,
  };

  try {
    const response = await axios.post(`${ML_SERVICE_URL}/recommend`, payload, { timeout: 15000 });

    return res.status(200).json({
      status: "success",
      data: response.data,
    });
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status >= 400 && error.response.status < 500 ? 400 : 502;

      return next(
        new AppError(
          "The workout recommendation service could not process the request.",
          statusCode,
        ),
      );
    }

    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ECONNABORTED" ||
      error.code === "ETIMEDOUT"
    ) {
      return next(new AppError("The ML service is unavailable. Please try again later.", 503));
    }

    return next(error);
  }
});
