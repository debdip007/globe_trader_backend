const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const verifyToken = require("../middlewares/auth.middleware");
const { createProductValidator } = require('../validators/product.validator');
const validate = require('../middlewares/validate');

router.post("/product/create", createProductValidator , validate, verifyToken, productController.createProduct);
router.post("/product/update", verifyToken, productController.getProducts);
router.post("/products", verifyToken, productController.getProducts);
router.get("/product/:id", verifyToken, productController.getProducts);


module.exports = router;