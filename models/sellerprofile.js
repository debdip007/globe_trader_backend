'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SellerProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SellerProfile.init({
    seller_id: DataTypes.INTEGER,
    company_name: DataTypes.TEXT,
    website: DataTypes.TEXT,
    business_registration_number: DataTypes.STRING,
    business_email_address: DataTypes.STRING,
    business_contact_name: DataTypes.STRING,
    business_contact_number: DataTypes.STRING,
    business_address : DataTypes.TEXT,
    business_city : DataTypes.TEXT,
    business_state : DataTypes.TEXT,
    business_pincode : DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'SellerProfile',
  });
  return SellerProfile;
};