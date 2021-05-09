'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Likes', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'likes_fk_user_id',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    await queryInterface.addConstraint('Likes', {
      fields: ['TweetId'],
      type: 'foreign key',
      name: 'likes_fk_tweet_id',
      references: {
        table: 'Tweets',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Likes', 'likes_fk_user_id')
    await queryInterface.removeConstraint('Likes', 'likes_fk_tweet_id')
  }
}
