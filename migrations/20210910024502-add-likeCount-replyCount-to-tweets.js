'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tweets', 'likeCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
    await queryInterface.addColumn('Tweets', 'replyCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tweets', 'likeCount')
    await queryInterface.removeColumn('Tweets', 'replyCount')
  }
}
