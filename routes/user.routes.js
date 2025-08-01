const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const userController = require("../controllers/user.controller");
const notification = require("../controllers/notification.controller");
const profileController = require("../controllers/profile.controller");
const authController = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/auth.middleware");
const { createProductValidator } = require('../validators/product.validator');
const { buyerListValidationRules } = require('../validators/userValidator');
const validate = require('../middlewares/validate');

router.post("/product/create", createProductValidator , validate, verifyToken, productController.createProduct);
router.post("/product/update", verifyToken, productController.createProduct);

router.post("/products", verifyToken, productController.getProducts);
router.get("/product/:id", verifyToken, productController.getProducts);

router.put("/product/additional-image", verifyToken, productController.addAdditionalImage);
router.delete("/product/additional-image/:id", verifyToken, productController.removeAdditionalImage);

router.post("/preferences/save", verifyToken, userController.savePreference);
router.post("/interest/save", verifyToken, userController.saveInterest);
router.post("/interest/update", verifyToken, userController.updateInterest);
router.post("/request/product/list", verifyToken, userController.requestProductList);
router.post("/notification/list", verifyToken, notification.getNotification);


router.post("/profile/update", verifyToken, profileController.updateProfile);
router.get("/profile/view/:id", verifyToken, profileController.viewProfile);

router.post("/buyer/list", buyerListValidationRules, validate, verifyToken, authController.getBuyerlist);

module.exports = router;