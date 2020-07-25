'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return Promise.all([
      queryInterface.addColumn(
        'Users',
        'tweetCount',
        {
          type: Sequelize.INTEGER,
          defaultValue: 0
        }
      ),
      queryInterface.addColumn(
        'Users',
        'likeCount',
        {
          type: Sequelize.INTEGER,
          defaultValue: 0
        }
      ),
      queryInterface.addColumn(
        'Users',
        'followerCount',
        {
          type: Sequelize.INTEGER,
          defaultValue: 0
        }
      ),
      queryInterface.addColumn(
        'Users',
        'followingCount',
        {
          type: Sequelize.INTEGER,
          defaultValue: 0
        }
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return Promise.all([
      queryInterface.removeColumn('Tweets', 'commentCount'),
      queryInterface.removeColumn('Tweets', 'likeCount'),
      queryInterface.removeColumn('Tweets', 'followerCount'),
      queryInterface.removeColumn('Tweets', 'followingCount')
    ])
  }
};
