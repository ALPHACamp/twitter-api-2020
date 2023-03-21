'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.STRING,
      defaultValue: 'user',
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    })
  }
}
