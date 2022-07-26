'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'account', {
      type: Sequelize.STRING,
      defaultValue: false
    })
    await queryInterface.addColumn('Users', 'front_cover', {
      type: Sequelize.STRING,
      defaultValue: false
    })
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'account')
    await queryInterface.removeColumn('Users', 'front_cover')
  }
};
