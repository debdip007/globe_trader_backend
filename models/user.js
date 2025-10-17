'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Role, {
        through: models.UserRole,
        foreignKey: 'user_id',
        otherKey: 'role_id'
      });
    }
  }
  User.init({
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    status: DataTypes.INTEGER,
    user_type: DataTypes.STRING,
    is_verified: DataTypes.INTEGER,
    country: DataTypes.TEXT,
    country_code: DataTypes.TEXT,
    platform_type: DataTypes.STRING,
    social_type: DataTypes.STRING,
    social_token: DataTypes.TEXT,
    password: DataTypes.TEXT,
    profile_image: DataTypes.TEXT,
    first_name: DataTypes.TEXT,
    last_name: DataTypes.TEXT,
    user_role: DataTypes.TEXT,
    reset_password_token: DataTypes.TEXT,
    reset_otp: DataTypes.TEXT,
    reset_password_expires: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};