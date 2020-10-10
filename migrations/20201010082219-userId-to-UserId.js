'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Chats', 'userId', 'UserId')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Chats', 'UserId', 'userId')
  }
};
