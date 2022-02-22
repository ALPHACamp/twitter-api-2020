'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'tweet_counts', {
      type: Sequelize.INTEGER
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'tweet_counts')
  }
}
