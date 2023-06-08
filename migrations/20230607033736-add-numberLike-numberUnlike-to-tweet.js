'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tweets', 'number_like', {
      type: Sequelize.INTEGER
    })
    await queryInterface.addColumn('Tweets', 'number_unlike', {
      type: Sequelize.INTEGER
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tweets', 'number_like')
    await queryInterface.removeColumn('Tweets', 'number_unlike')
  }
};
