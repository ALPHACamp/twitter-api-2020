'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Replies', 'userId', 'UserId')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Replies', 'UserId', 'userId')
  }
}
