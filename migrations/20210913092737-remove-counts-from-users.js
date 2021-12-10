'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'followingCount')
    await queryInterface.removeColumn('Users', 'followerCount')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'followingCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    })
    await queryInterface.addColumn('Users', 'followerCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    })
  },
}
