const axios = require("axios");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8001";

exports.getRecommendations = catchAsync(async (req, res, next) => {
  const {
    equipment,
    bodyPart,
    target,
    difficulty,
    category,
    description = "",
    top_n = 10,
    excluded_exercises = [],
  } = req.body;

  // Validate required fields before calling the ML service.
  if (!equipment || !bodyPart || !target || !difficulty || !category) {
    return next(
      new AppError("equipment, bodyPart, target, difficulty, and category are required.", 400),
    );
  }

  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/recommend`,
      {
        equipment,
        bodyPart,
        target,
        difficulty,
        category,
        description,
        top_n,
        excluded_exercises,
      },
      { timeout: 15000 },
    );

    res.status(200).json({
      status: "success",
      data: response.data,
    });
  } catch (error) {
    // The ML service responded with an error.
    if (error.response) {
      const statusCode = error.response.status >= 400 && error.response.status < 500 ? 400 : 502;

      return next(
        new AppError(
          "The workout recommendation service could not process the request.",
          statusCode,
        ),
      );
    }

    // No response: service unavailable or request timed out.
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ECONNABORTED" ||
      error.code === "ETIMEDOUT"
    ) {
      return next(new AppError("The ML service is unavailable. Please try again later.", 503));
    }

    // Let the global error handler handle unexpected errors.
    return next(error);
  }
});
