'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_name: {
        type: Sequelize.TEXT
      },
      sku: {
        type: Sequelize.STRING
      },
      main_image: {
        type: Sequelize.TEXT
      },
      product_unit: {
        type: Sequelize.STRING
      },
      minimum_order_qty: {
        type: Sequelize.STRING
      },
      product_capacity: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      product_description: {
        type: Sequelize.TEXT
      },
      category: {
        type: Sequelize.STRING
      },
      sub_category: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      },
      include: {
        type: Sequelize.INTEGER
      },
      seller_id: {
        type: Sequelize.INTEGER
      },
      device_type: {
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
    await queryInterface.dropTable('Products');
  }
};