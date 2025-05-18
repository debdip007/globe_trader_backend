const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.get("/category", verifyToken, categoryController.getCategory);
router.get("/sub-category/:id", verifyToken, categoryController.getSubCategory);

module.exports = router;