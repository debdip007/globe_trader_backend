const { User, Role } = require('../models');

/**
 * Assign a role to a user
 */
exports.assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const user = await User.findByPk(userId);
    const role = await Role.findByPk(roleId);

    if (!user || !role) {
      return res.status(404).json({ message: 'User or Role not found' });
    }

    // Sequelize many-to-many association helper
    await user.addRole(role);

    res.json({ message: `Role '${role.name}' assigned to user '${user.username}'` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all roles of a user
 */
exports.getUserRoles = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      include: Role
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: user.username, roles: user.Roles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Remove a role from a user
 */
exports.removeUserRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const user = await User.findByPk(userId);
    const role = await Role.findByPk(roleId);

    if (!user || !role) {
      return res.status(404).json({ message: 'User or Role not found' });
    }

    await user.removeRole(role);

    res.json({ message: `Role '${role.name}' removed from user '${user.username}'` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};