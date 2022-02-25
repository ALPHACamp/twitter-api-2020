'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Likes', 'isDeleted', {
      allowNull: false,
      type: Sequelize.BOOLEAN
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Likes', 'isDeleted')
  }
}
