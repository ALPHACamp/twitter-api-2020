'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'lastLogin', 'lastJoinPublic')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'lastJoinPublic', 'lastLogin')
  }
}
