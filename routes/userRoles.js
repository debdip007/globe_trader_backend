const express = require('express');
const router = express.Router();
const { assignRoleToUser, getUserRoles, removeUserRole } = require('../controllers/userRoleController');

// Assign role to user
router.post('/assign', assignRoleToUser);

// Get all roles of a user
router.get('/:userId', getUserRoles);

// Remove role from user
router.post('/remove', removeUserRole);

module.exports = router;