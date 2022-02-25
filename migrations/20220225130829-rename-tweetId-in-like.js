'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Likes', 'tweetId', 'TweetId')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Likes', 'TweetId', 'tweetId')
  }
}
