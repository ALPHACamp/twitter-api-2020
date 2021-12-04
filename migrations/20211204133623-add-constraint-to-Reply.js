'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addConstraint('Replies', ['TweetId'], {
        type: 'foreign key',
        name: 'fk_reply_tweets',
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
    return queryInterface.removeConstraint('Replies', 'fk_reply_Tweets')
  }
}
