const db = require('./models');
const { User, Role } = db;

(async () => {
  await db.sequelize.sync({ force: true });

  const user = await User.create({ username: 'TestUser' });
  const role = await Role.create({ name: 'Admin' });

  await user.addRole(role);  // ✅ should work
  const roles = await user.getRoles(); // ✅ should work

  console.log('User Roles:', roles.map(r => r.name));
})();