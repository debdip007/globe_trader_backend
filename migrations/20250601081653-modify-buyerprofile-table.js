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
    await queryInterface.changeColumn('BuyerProfiles', 'interest_category', {
      type: Sequelize.STRING, // Replace with the new data type
    });

    await queryInterface.changeColumn('BuyerProfiles', 'interest_sub_category', {
      type: Sequelize.STRING, // Replace with the new data type
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
