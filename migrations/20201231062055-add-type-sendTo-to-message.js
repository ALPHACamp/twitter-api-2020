'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Messages', 'type', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),
        queryInterface.addColumn('Messages', 'sendTo', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t })
      ])
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Messages', 'type', { transaction: t }),
        queryInterface.removeColumn('Messages', 'sendTo', { transaction: t })
      ])
    })
  }
}
