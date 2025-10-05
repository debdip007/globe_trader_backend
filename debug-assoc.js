// debug-assoc.js
(async () => {
  const db = require('./models');  // ✅ adjust if your models folder is elsewhere
  console.log('Models loaded:', Object.keys(db));

  console.log('User.associations keys:', Object.keys(db.User.associations || {}));
  console.log('User.prototype.getRoles type:', typeof (db.User && db.User.prototype && db.User.prototype.getRoles));

  const user = await db.User.findOne();
  if (!user) {
    console.log('⚠️ No user found in DB. Create a user first, then re-run this script.');
    return;
  }

  console.log('user.constructor.name:', user.constructor.name);
  console.log('user instanceof db.User:', user instanceof db.User);
  console.log(
    'User-instance proto keys (filtered):',
    Object.getOwnPropertyNames(Object.getPrototypeOf(user)).filter(k => /role/i.test(k))
  );

  console.log('typeof user.getRoles:', typeof user.getRoles);

  process.exit(0);
})();