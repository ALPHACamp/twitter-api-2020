'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Likes', 'userId', 'UserId')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Likes', 'UserId', 'userId')
  }
}
