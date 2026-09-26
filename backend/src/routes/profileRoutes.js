const express = require("express");
const onboardingStep = require("../controllers/onBoarding");
const router = express.Router();

router.post("/", onboardingStep.onBoardingStep1);
router.patch("/onboardingStep2", onboardingStep.onBoardingStep2);
router.patch("/onboardingStep3", onboardingStep.onBoardingStep3);
// router.get("/", profileController.getProfile);
// router.patch("/", profileController.updateProfile);

module.exports = router;
