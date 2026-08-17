const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const AppError = require("./src/utils/appError");
const globalErrorHandler = require("./src/controllers/errorController");
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const { protect } = require("./src/middlewares/authMiddleware");

// Load environment variables
dotenv.config();

const app = express();

// Middleware (Order matters!)
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Allow server to parse JSON body data
app.use("/api/auth", authRoutes);
app.use("/api/profile", protect, profileRoutes);

// Catch-all for unknown routes (MUST be at the very bottom
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Optional: Global error handler for unexpected crashes
app.use(globalErrorHandler);

module.exports = app;
