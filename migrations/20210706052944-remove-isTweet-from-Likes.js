'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Likes', 'isTweet')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Likes', 'isTweet', {
      type: Sequelize.BOOLEAN,
    });
  }
};
