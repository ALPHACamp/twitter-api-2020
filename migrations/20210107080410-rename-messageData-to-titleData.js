'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Notifications', 'messageData', 'titleData')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('tableName', 'titleData', 'messageData')
  }
}
