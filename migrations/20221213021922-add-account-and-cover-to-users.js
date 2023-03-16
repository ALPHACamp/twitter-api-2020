'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('Users', 'account', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('Users', 'cover', {
        type: Sequelize.STRING
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('Users', 'account'),
      queryInterface.removeColumn('Users', 'cover')
    ])
  }
}
