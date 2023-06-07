'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tweets', 'numberLike', {
      type: Sequelize.INTEGER
    })
    await queryInterface.addColumn('Tweets', 'numberUnlike', {
      type: Sequelize.INTEGER
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tweets', 'numberLike')
    await queryInterface.removeColumn('Tweets', 'numberUnlike')
  }
};
