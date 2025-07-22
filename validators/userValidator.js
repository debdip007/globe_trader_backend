const { body } = require('express-validator');

const otpValidationRules = [
  body('email')
    .isEmail()
    .withMessage('A valid email is required.')
];

const registerValidationRules = [
  body('first_name')
    .notEmpty()
    .withMessage('First Name is required.'),
  body('email')
    .isEmail()
    .withMessage('A valid email is required.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  body('phone')
    .notEmpty({ min: 6 })
    .withMessage('Phone Number is required.'),
  body('otp')
    .isLength({ min: 4 })
    .withMessage('OTP must be at least 4 characters long.'),
];

const loginValidationRules = [
  body('email')
    .isEmail()
    .withMessage('A valid email is required.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')  
];

const buyerListValidationRules = [
  body('seller_id')
    .notEmpty()
    .withMessage('seller_id is required.')
];

module.exports = {
  otpValidationRules,
  registerValidationRules,
  loginValidationRules,
  buyerListValidationRules
};