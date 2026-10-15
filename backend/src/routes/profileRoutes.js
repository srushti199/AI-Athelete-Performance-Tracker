const express = require("express");
const onboardingStep = require("../controllers/onBoarding");
const profileController = require("../controllers/profileController");

const router = express.Router();

router.post("/", onboardingStep.onBoardingStep1);
router.patch("/onboardingStep2", onboardingStep.onBoardingStep2);
router.patch("/onboardingStep3", onboardingStep.onBoardingStep3);

router.get("/", profileController.getProfile);
router.patch("/", profileController.updateProfile);

// Delete only the selected injury record.
router.delete("/injuries/:injuryId", profileController.deleteInjury);

module.exports = router;
