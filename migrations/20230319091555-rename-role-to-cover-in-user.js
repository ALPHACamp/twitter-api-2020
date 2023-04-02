'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'role', 'cover')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'cover', 'role')
  }
}
