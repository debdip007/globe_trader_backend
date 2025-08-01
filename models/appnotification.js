'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AppNotification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AppNotification.init({
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    type: DataTypes.STRING,
    is_read: DataTypes.BOOLEAN,
    sent_at: DataTypes.DATE,
    read_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'AppNotification',
  });
  return AppNotification;
};