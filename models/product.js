'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    product_name: DataTypes.TEXT,
    sku: DataTypes.STRING,
    main_image: DataTypes.TEXT,
    product_unit: DataTypes.STRING,
    minimum_order_qty: DataTypes.STRING,
    product_capacity: DataTypes.STRING,
    country: DataTypes.STRING,
    product_description: DataTypes.TEXT,
    category: DataTypes.STRING,
    sub_category: DataTypes.STRING,
    status: DataTypes.INTEGER,
    include: DataTypes.INTEGER,
    seller_id: DataTypes.INTEGER,
    device_type: DataTypes.STRING,
    minimum_order_qty_unit: DataTypes.TEXT,
    product_quantity: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};