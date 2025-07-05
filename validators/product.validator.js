const { body } = require('express-validator');

const createProductValidator = [
  body('product_name')
    .notEmpty()
    .withMessage('Product Name is required.'),
  body('sku')
    .notEmpty()
    .withMessage('Product SKU is required.')
];

module.exports = {
  createProductValidator  
};