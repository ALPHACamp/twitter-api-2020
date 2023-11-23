'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'cover', {
      type: Sequelize.STRING,
      defaultValue: 'https://i.imgur.com/4kg6TEu.jpeg'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'cover')
  }
}
