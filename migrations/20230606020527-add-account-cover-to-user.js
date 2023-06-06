'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Users', 'account',
        {
          type: Sequelize.STRING
        }),
      queryInterface.addColumn('Users', 'cover',
        {
          type: Sequelize.STRING

        })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'account'),
      queryInterface.removeColumn('Users', 'cover')
    ])
  }
}
