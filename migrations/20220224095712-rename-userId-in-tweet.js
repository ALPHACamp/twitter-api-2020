'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Tweets', 'userId', 'UserId')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Tweets', 'UserId', 'userId')
  }
};
