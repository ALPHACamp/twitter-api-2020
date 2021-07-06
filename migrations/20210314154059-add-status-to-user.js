'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'status', {
      type: Sequelize.STRING,
      defaultValue: 'offline'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'status')
  }
};
