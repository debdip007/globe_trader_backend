const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken, authorizeRoles } = require("../middlewares/auth.middleware");
const { otpValidationRules, registerValidationRules, loginValidationRules } = require('../validators/userValidator');
const validate = require('../middlewares/validate');

router.post("/generate-otp", otpValidationRules, validate, authController.generateOtp);
router.post("/register", registerValidationRules, validate, authController.register);
router.post("/login", loginValidationRules, validate, authController.login);
router.post("/get-token", authController.refreshToken);

router.post("/forgot-password", authController.forgotPassword);
router.get("/reset-password/:token", authController.verifyResetToken);
router.post("/reset-password", authController.resetPassword);

router.get("/profile", verifyToken, authorizeRoles('admin'), (req, res) => {
  res.status(200).send("User Profile");
});

router.post("/send-email", authController.sendTestEmail);
router.get("/test-function", authController.testFunction);

module.exports = router;