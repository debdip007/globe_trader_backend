const { body } = require('express-validator');

const createProductValidator = [
  body('product_name')
    .notEmpty()
    .withMessage('Product Name is required.'),
  body('sku')
    .notEmpty()
    .withMessage('Product SKU is required.'),
  body('main_image')
    .notEmpty()
    .withMessage('Product main image is required.'),
  body('category')
    .notEmpty()
    .withMessage('Category is required.')
];

module.exports = {
  createProductValidator  
};