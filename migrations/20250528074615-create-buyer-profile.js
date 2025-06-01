'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BuyerProfiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      buyer_id: {
        type: Sequelize.INTEGER
      },
      company_name: {
        type: Sequelize.TEXT
      },
      website: {
        type: Sequelize.TEXT
      },
      company_type: {
        type: Sequelize.TEXT
      },
      operating_location: {
        type: Sequelize.INTEGER
      },
      store_count: {
        type: Sequelize.INTEGER
      },
      operation_type: {
        type: Sequelize.STRING
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
      interest_category: {
        type: Sequelize.INTEGER
      },
      interest_sub_category: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('BuyerProfiles');
  }
};