'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'account', {
      type: Sequelize.STRING,
      defaultValue: 'anonymous user',
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'account', {
      type: Sequelize.STRING,
      allowNull: false
    })
  }
}
