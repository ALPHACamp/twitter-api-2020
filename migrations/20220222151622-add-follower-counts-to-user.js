'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'follower_counts', {
      type: Sequelize.INTEGER
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'follower_counts')
  }
}
