'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'introduction', 'intro')
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'introduction')
  }
}
