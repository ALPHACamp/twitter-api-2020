'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Tweets', 'likeCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Tweets', 'likeCount')
  }
}
