const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const AppError = require("./src/utils/appError");
const globalErrorHandler = require("./src/controllers/errorController");
const { protect } = require("./src/middlewares/authMiddleware");

const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const recommendationRoutes = require("./src/routes/recommendationRoutes");
const workoutPlanRoutes = require("./src/routes/workoutPlanRoutes");
const progressRoutes = require("./src/routes/progressRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", protect, profileRoutes);
app.use("/api/workout-plans", protect, workoutPlanRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/progress", protect, progressRoutes);
app.use("/api/dashboard", protect, dashboardRoutes);

// Handle unknown routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
