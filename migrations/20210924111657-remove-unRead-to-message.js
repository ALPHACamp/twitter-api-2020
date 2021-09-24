'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Messages', 'unRead')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Messages', 'unRead')
  }
}
