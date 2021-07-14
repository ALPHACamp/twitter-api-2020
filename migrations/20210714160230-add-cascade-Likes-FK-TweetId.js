'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('Likes', {
      fields: ['TweetId'],
      type: 'foreign key',
      name: 'Likes_TweetId_Const_Key',
      references: {
        table: 'Tweets',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('Likes', 'Likes_TweetId_Const_Key')
  }
}
