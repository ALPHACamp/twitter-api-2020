'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Chatrooms',
      [
        {
          id: 5,
          roomName: '公共聊天室',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Chatrooms', null, {});
  }
};
