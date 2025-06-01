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
    const tableDefinition = await queryInterface.describeTable("UserPreferences");

    if (!tableDefinition["product_id"]) {
      await queryInterface.addColumn("UserPreferences", "product_id", {
        type: Sequelize.STRING, // Replace with your desired data type
        allowNull: true,        // Set according to your requirements
      });
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('UserPreferences', 'product_id');
  }
};
