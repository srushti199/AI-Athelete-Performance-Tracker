const express = require("express");
const progressController = require("../controllers/progressController");

const router = express.Router();

router.get("/", progressController.getProgressAnalytics);

module.exports = router;
