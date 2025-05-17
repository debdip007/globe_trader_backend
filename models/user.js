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
    profile_image: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};