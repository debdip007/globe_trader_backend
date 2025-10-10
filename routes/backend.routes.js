const express = require('express');
const router = express.Router();
const backendController = require('../controllers/backend.controller');
const { verifyToken } = require("../middlewares/auth.middleware");

// Assign role to user
router.post('/user-list', verifyToken, backendController.getUserList);
router.post('/product-list', verifyToken, backendController.getProductList);

module.exports = router;