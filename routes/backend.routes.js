const express = require('express');
const router = express.Router();
const backendController = require('../controllers/backend.controller');
const { verifyToken } = require("../middlewares/auth.middleware");

// Assign role to user
router.post('/user-list', verifyToken, backendController.getUserList);
router.post('/product-list', verifyToken, backendController.getProductList);
router.post('/products', backendController.getAllProducts);
router.get('/role-list', verifyToken, backendController.getRoleList);
router.get('/permission-list', verifyToken, backendController.getPermissionList);
router.get('/category-list', verifyToken, backendController.getCategoryList);
router.post('/modify-category', verifyToken, backendController.modifyCategory);
router.post('/dashboard-details', verifyToken, backendController.dashboardDetails);
router.post('/request-list', verifyToken, backendController.requestProductListByUserType);
router.post('/user-register', verifyToken, backendController.userRegister);



module.exports = router;