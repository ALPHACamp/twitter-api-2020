'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Chats', 'receivedUserId', {
      type: Sequelize.INTEGER,
      allowNull: false
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Chats', 'receivedUserId')
  }
};
