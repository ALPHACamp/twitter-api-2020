'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Users', 'followerCount', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('Users', 'followingCount', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('Users', 'tweetCount', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('Users', 'replyCount', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('Users', 'likedCount', {
        type: Sequelize.INTEGER
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'followerCount'),
      queryInterface.removeColumn('Users', 'followingCount'),
      queryInterface.removeColumn('Users', 'tweetCount'),
      queryInterface.removeColumn('Users', 'replyCount'),
      queryInterface.addColumn('Users', 'likedCount')
    ])
  }
}
