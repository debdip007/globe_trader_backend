'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPreference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserPreference.init({
    user_id: DataTypes.INTEGER,
    user_type: DataTypes.STRING,
    product_id: DataTypes.INTEGER,
    preferance: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserPreference',
  });
  return UserPreference;
};