'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Replies', 'tweetId', 'TweetId')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Tweets', 'TweetId', 'tweetId')
  }
}
