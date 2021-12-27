'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Members', 'online', {
      type: Sequelize.BOOLEAN
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Members', 'online')
  }
}