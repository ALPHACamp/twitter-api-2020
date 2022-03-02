'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'likeCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'likeCount')
  }
}
