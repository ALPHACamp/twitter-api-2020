'use strict'

module.exports = {

  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Replies', {
      fields: ['Tweet_id'],
      type: 'foreign key',
      name: 'tweets_replies_constraint',
      references: {
        table: 'Tweets',
        field: 'id'
      },
      onDelete: 'CASCADE'
    })
    await queryInterface.addConstraint('Likes', {
      fields: ['Tweet_id'],
      type: 'foreign key',
      name: 'tweets_likes_constraint',
      references: {
        table: 'Tweets',
        field: 'id'
      },
      onDelete: 'CASCADE'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'Replies',
      'tweets_replies_constraint'
    )
    await queryInterface.removeConstraint(
      'Likes',
      'tweets_likes_constraint'
    )
  }
}
