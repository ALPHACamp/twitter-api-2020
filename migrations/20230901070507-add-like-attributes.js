'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('Likes', {
      name: 'unique_constraint',
      unique: true,
      fields: ['UserId', 'TweetId']
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('Likes', 'unique_constraint')
  }
}
