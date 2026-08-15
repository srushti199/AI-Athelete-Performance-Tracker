const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware (Order matters!)
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Allow server to parse JSON body data

const PORT = process.env.PORT || 4000;

// Start the server safely
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Catch-all for unknown routes (MUST be at the very bottom
app.use((req, res, next) => {
  res.status(400).json({ message: "Route not found" });
});

// Optional: Global error handler for unexpected crashes
app.use((req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: "something went wrong!" });
});
