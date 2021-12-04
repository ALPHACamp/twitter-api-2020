'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addConstraint('Likes', ['TweetId'], {
        type: 'foreign key',
        name: 'fk_like_tweets',
        references: {
          table: 'Tweets',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Likes', 'fk_like_Tweets')
  }
}
