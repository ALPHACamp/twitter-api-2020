'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Likes', {
      fields: ['TweetId'],
      type: 'foreign key',
      name: 'delete-association',
      references: {
        table: 'Tweets',
        field: 'id'
      },
      onDelete: 'cascade'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Likes', 'delete-association')
  }
}
