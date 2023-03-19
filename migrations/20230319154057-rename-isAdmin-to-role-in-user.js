'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'isAdmin', 'role')
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.renameColumn("Users", "role", "isAdmin");
  }
};
