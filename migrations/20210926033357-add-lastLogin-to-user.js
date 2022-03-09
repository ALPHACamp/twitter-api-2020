'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'lastLogin', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'lastLogin')
  }
}
