'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'intro', 'introduction')
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'intro')
  }
}
