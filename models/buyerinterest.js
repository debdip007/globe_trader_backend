'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BuyerInterest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BuyerInterest.init({
    buyer_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    seller_id: DataTypes.INTEGER,
    notes: DataTypes.TEXT,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BuyerInterest',
  });
  return BuyerInterest;
};