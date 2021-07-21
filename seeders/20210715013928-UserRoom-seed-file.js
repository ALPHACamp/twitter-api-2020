'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('UserRooms',
      [
        {
          UserId: 15,
          ChatroomId: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          UserId: 25,
          ChatroomId: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          UserId: 35,
          ChatroomId: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          UserId: 45,
          ChatroomId: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          UserId: 55,
          ChatroomId: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        },

      ], {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UserRooms', null, {});
  }
};
