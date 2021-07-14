'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('Replies', {
      fields: ['TweetId'],
      type: 'foreign key',
      name: 'Replies_TweetId_Const_Key',
      references: {
        table: 'Tweets',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('Replies', 'Replies_TweetId_Const_Key')
  }
}
