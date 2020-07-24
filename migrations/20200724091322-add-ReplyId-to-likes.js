'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Likes', 'ReplyId', {
      type: Sequelize.INTEGER,
      reference: {
        model: 'Replies',
        key: 'id'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Likes', 'ReplyId')
  }
};
