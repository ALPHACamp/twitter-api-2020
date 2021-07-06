'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'account', {
      type: Sequelize.STRING
    })
    queryInterface.addColumn('Users', 'cover', {
      type: Sequelize.STRING,
      defaultValue: 'https://images.unsplash.com/27/perspective.jpg?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'account')
    queryInterface.removeColumn('Users', 'cover')
  }
}
