'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'account', {
      allowNull: false,
      defaultValue: 'accountName',
      type: Sequelize.STRING,
    })
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'account')
  }
}
