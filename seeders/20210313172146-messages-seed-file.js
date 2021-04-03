'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Messages',
      [
        {
          id: 1,
          fromId: 11,
          toId: null,
          content: 'Hi, I am new here.',
          sendTime: new Date(Date.now() - 50000000),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 11,
          fromId: 11,
          toId: 31,
          content: 'Johnny, do you want to marry me?',
          sendTime: new Date(Date.now() - 40000000),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 21,
          fromId: 31,
          toId: 11,
          content: 'fuck off',
          sendTime: new Date(Date.now() - 35000000),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 31,
          fromId: 21,
          toId: 11,
          content: 'When will you pay me back? You fraud!!!',
          sendTime: new Date(Date.now() - 35000000),
          createdAt: new Date(),
          updatedAt: new Date()
        }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Messages', null, {})
  }
}
