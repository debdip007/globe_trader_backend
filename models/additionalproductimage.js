'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdditionalProductImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AdditionalProductImage.init({
    image: DataTypes.TEXT,
    product_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    sort_order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AdditionalProductImage',
  });
  return AdditionalProductImage;
};