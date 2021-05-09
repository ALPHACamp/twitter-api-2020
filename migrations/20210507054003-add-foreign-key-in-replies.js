'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Replies', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'replies_fk_user_id',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    await queryInterface.addConstraint('Replies', {
      fields: ['TweetId'],
      type: 'foreign key',
      name: 'replies_fk_tweet_id',
      references: {
        table: 'Tweets',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Replies', 'replies_fk_user_id')
    await queryInterface.removeConstraint('Replies', 'replies_fk_tweet_id')
  }
}
