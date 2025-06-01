'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SellerProfiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      seller_id: {
        type: Sequelize.INTEGER
      },
      company_name: {
        type: Sequelize.TEXT
      },
      website: {
        type: Sequelize.TEXT
      },
      business_registration_number: {
        type: Sequelize.STRING
      },
      business_email_address: {
        type: Sequelize.STRING
      },
      business_contact_name: {
        type: Sequelize.STRING
      },
      business_contact_number: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SellerProfiles');
  }
};