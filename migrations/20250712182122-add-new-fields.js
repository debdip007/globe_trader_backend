'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('BuyerProfiles', 'business_country_names', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('SellerProfiles', 'business_country_names', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('Products', 'product_capacity_unit', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('BuyerProfiles', 'business_country_names');
    await queryInterface.removeColumn('SellerProfiles', 'business_country_names');
    await queryInterface.removeColumn('Products', 'product_capacity_unit');
  }
};
