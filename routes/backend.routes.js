const express = require('express');
const router = express.Router();
const backendController = require('../controllers/backend.controller');
const { verifyToken } = require("../middlewares/auth.middleware");

// Assign role to user
router.post('/user-list', verifyToken, backendController.getUserList);
router.post('/product-list', verifyToken, backendController.getProductList);
router.get('/role-list', verifyToken, backendController.getRoleList);
router.get('/permission-list', verifyToken, backendController.getPermissionList);
router.post('/modify-category', verifyToken, backendController.modifyCategory);

module.exports = router;