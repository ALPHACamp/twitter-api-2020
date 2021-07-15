'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Chats', 'ChatroomId',
      {
        type: Sequelize.INTEGER,
      });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Chats', 'ChatroomId')
  }
};
