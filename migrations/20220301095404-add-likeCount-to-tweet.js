'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tweets', 'likeCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tweets', 'likeCount')
  }
}
