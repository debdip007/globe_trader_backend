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
    const tableDefinition = await queryInterface.describeTable("BuyerProfiles");

    if (tableDefinition["operating_location"]) {
      await queryInterface.removeColumn("BuyerProfiles", "operating_location", {
        type: Sequelize.STRING, // Replace with your desired data type
        allowNull: true,        // Set according to your requirements
      });
    }

    if (!tableDefinition["business_address"]) {
      await queryInterface.removeColumn("BuyerProfiles", "business_address", {
        type: Sequelize.TEXT, // Replace with your desired data type
        allowNull: true,        // Set according to your requirements
      });
    }

    if (!tableDefinition["business_city"]) {
      await queryInterface.removeColumn("BuyerProfiles", "business_city", {
        type: Sequelize.TEXT, // Replace with your desired data type
        allowNull: true,        // Set according to your requirements
      });
    }

    if (!tableDefinition["business_state"]) {
      await queryInterface.removeColumn("BuyerProfiles", "business_state", {
        type: Sequelize.TEXT, // Replace with your desired data type
        allowNull: true,        // Set according to your requirements
      });
    }

    if (!tableDefinition["business_pincode"]) {
      await queryInterface.removeColumn("BuyerProfiles", "business_pincode", {
        type: Sequelize.TEXT, // Replace with your desired data type
        allowNull: true,        // Set according to your requirements
      });
    }

    const sellertableDefinition = await queryInterface.describeTable("SellerProfiles");

    if (!sellertableDefinition["business_address"]) {
      await queryInterface.removeColumn("SellerProfiles", "business_address", {
        type: Sequelize.TEXT, // Replace with your desired data type
        allowNull: true,        // Set according to your requirements
      });
    }

    if (!sellertableDefinition["business_city"]) {
      await queryInterface.removeColumn("SellerProfiles", "business_city", {
        type: Sequelize.TEXT, // Replace with your desired data type
        allowNull: true,        // Set according to your requirements
      });
    }

    if (!sellertableDefinition["business_state"]) {
      await queryInterface.removeColumn("SellerProfiles", "business_state", {
        type: Sequelize.TEXT, // Replace with your desired data type
        allowNull: true,        // Set according to your requirements
      });
    }

    if (!sellertableDefinition["business_pincode"]) {
      await queryInterface.removeColumn("SellerProfiles", "business_pincode", {
        type: Sequelize.TEXT, // Replace with your desired data type
        allowNull: true,        // Set according to your requirements
      });
    }

    

    // await queryInterface.removeColumn('BuyerProfiles', 'operating_location');

    // await queryInterface.addColumn('BuyerProfiles', 'business_address', {
    //   type: Sequelize.TEXT,
    // });

    // await queryInterface.addColumn('BuyerProfiles', 'business_city', {
    //   type: Sequelize.TEXT,
    // });

    // await queryInterface.addColumn('BuyerProfiles', 'business_state', {
    //   type: Sequelize.TEXT,
    // });

    // await queryInterface.addColumn('BuyerProfiles', 'business_pincode', {
    //   type: Sequelize.TEXT,
    // });

    // await queryInterface.addColumn('SellerProfiles', 'business_address', {
    //   type: Sequelize.TEXT,
    // });

    // await queryInterface.addColumn('SellerProfiles', 'business_city', {
    //   type: Sequelize.TEXT,
    // });

    // await queryInterface.addColumn('SellerProfiles', 'business_state', {
    //   type: Sequelize.TEXT,
    // });

    // await queryInterface.addColumn('SellerProfiles', 'business_pincode', {
    //   type: Sequelize.TEXT,
    // });
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
