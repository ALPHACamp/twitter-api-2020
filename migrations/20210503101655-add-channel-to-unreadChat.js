'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('unreadChats', 'channel', {
      type: Sequelize.STRING,
      allowNull: false
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('unreadChats', 'channel')
  }
}
