'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'account', { type: Sequelize.STRING, allowNull: false })
    return queryInterface.addColumn('Users', 'cover', { type: Sequelize.STRING })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'account')
    return queryInterface.removeColumn('Users', 'cover')
  }
};
