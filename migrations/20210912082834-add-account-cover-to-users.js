'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "account", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Users", "cover", {
      type: Sequelize.STRING,
    });
    
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn("Users", "account");
    queryInterface.removeColumn("Users", "cover");
  }
};
