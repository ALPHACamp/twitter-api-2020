'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    await queryInterface.addColumn('Tweets', 'replyCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
    await queryInterface.addColumn('Tweets', 'likeCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    await queryInterface.removeColumn('Tweets', 'replyCount')
    await queryInterface.removeColumn('Tweets', 'likeCount')
  }
};
