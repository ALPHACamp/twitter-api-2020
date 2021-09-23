'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users','account', {
      type: Sequelize.STRING
    })
    await queryInterface.addColumn('Users', 'cover', {
      type: Sequelize.STRING
    })
    await queryInterface.addColumn('Users', 'followerCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
    await queryInterface.addColumn('Users', 'followingCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
    await queryInterface.addColumn('Users', 'tweetCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'account')
    await queryInterface.removeColumn('Users', 'cover')
    await queryInterface.removeColumn('Users', 'followerCount')
    await queryInterface.removeColumn('Users', 'followingCount')
    await queryInterface.removeColumn('Users', 'tweetCount')
  }
}
