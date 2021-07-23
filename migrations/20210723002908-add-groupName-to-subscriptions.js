'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Subscriptions', 'groupName', {
      type: Sequelize.STRING,
      defaultValue: false
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Subscriptions', 'groupName')
  }
}
