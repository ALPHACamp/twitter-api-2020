'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const chats = [
        {
          ChannelId: 1,
          UserId: 2,
          message: 'Hi, My name is User1.',
          createdAt: new Date(2020, 11, 10, 10, 0, 0),
          updatedAt: new Date(2020, 11, 10, 10, 0, 0)
        },
        {
          ChannelId: 1,
          UserId: 3,
          message: 'Hi, My name is User2.',
          createdAt: new Date(2020, 11, 10, 10, 0, 30),
          updatedAt: new Date(2020, 11, 10, 10, 0, 30)
        },
        {
          ChannelId: 1,
          UserId: 2,
          message: 'How ar u today?',
          createdAt: new Date(2020, 11, 10, 10, 1, 0),
          updatedAt: new Date(2020, 11, 10, 10, 1, 0)
        },
        {
          ChannelId: 2,
          UserId: 4,
          message: 'Feel bored hang out 2gether?',
          createdAt: new Date(2020, 11, 10, 10, 30, 0),
          updatedAt: new Date(2020, 11, 10, 10, 30, 0)
        },
        {
          ChannelId: 2,
          UserId: 2,
          message: 'Nope, I need to prepare my exam.',
          createdAt: new Date(2020, 11, 10, 10, 31, 0),
          updatedAt: new Date(2020, 11, 10, 10, 31, 0)
        },
        {
          ChannelId: 2,
          UserId: 4,
          message: 'okay :(',
          createdAt: new Date(2020, 11, 10, 10, 32, 0),
          updatedAt: new Date(2020, 11, 10, 10, 32, 0)
        },
      ]

      await queryInterface.bulkInsert('Chatprivates', chats)
    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('Chatprivates', {})
    } catch (error) {
      console.log(error)
    }
  }
};
