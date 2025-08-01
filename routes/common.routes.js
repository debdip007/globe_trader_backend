const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const commonController = require("../controllers/common.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.get("/category", verifyToken, categoryController.getCategory);
router.get("/sub-category/:id", verifyToken, categoryController.getSubCategory);
router.get("/cms-page/:type", commonController.getPageDetails);

module.exports = router;