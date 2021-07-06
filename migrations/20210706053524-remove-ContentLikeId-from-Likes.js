'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Likes', 'ContentLikedId')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Likes', 'ContentLikedId', {
      type: Sequelize.INTEGER,
    });
  }
};
