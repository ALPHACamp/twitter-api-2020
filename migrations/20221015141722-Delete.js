'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Likes', 'isLike', {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Likes', 'isLike', {
      type: Sequelize.BOOLEAN
    })
  }
}
