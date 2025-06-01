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
    // await queryInterface.removeColumn('BuyerProfiles', 'operating_location');

    await queryInterface.addColumn('BuyerProfiles', 'business_address', {
      type: Sequelize.TEXT,
    });

    await queryInterface.addColumn('BuyerProfiles', 'business_city', {
      type: Sequelize.TEXT,
    });

    await queryInterface.addColumn('BuyerProfiles', 'business_state', {
      type: Sequelize.TEXT,
    });

    await queryInterface.addColumn('BuyerProfiles', 'business_pincode', {
      type: Sequelize.TEXT,
    });

    await queryInterface.addColumn('SellerProfiles', 'business_address', {
      type: Sequelize.TEXT,
    });

    await queryInterface.addColumn('SellerProfiles', 'business_city', {
      type: Sequelize.TEXT,
    });

    await queryInterface.addColumn('SellerProfiles', 'business_state', {
      type: Sequelize.TEXT,
    });

    await queryInterface.addColumn('SellerProfiles', 'business_pincode', {
      type: Sequelize.TEXT,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
