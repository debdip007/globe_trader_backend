const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/auth.middleware");
const { otpValidationRules, registerValidationRules, loginValidationRules } = require('../validators/userValidator');
const validate = require('../middlewares/validate');

router.post("/generate-otp", otpValidationRules, validate, authController.generateOtp);
router.post("/register", registerValidationRules, validate, authController.register);
router.post("/login", loginValidationRules, validate, authController.login);
router.get("/profile", verifyToken, (req, res) => {
  res.status(200).send("User Profile");
});

module.exports = router;