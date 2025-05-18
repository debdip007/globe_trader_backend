const { validationResult } = require('express-validator');

const customValidationResult = validationResult.withDefaults({
  formatter: error => {
    return {
        type: error.type,
        message: error.msg,
        path: error.path,
        location: error.location      
    };
  }
});

const validate = (req, res, next) => {
  const errors = customValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }
  next();
};

module.exports = validate;