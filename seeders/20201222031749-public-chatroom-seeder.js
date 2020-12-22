'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const chats = []
      for (let i = 0; i < 10; i++) {
        const UserId = Math.floor(Math.random() * 5) + 2
        const date = new Date(2020, 12, 1, Math.ceil(Math.random() * 3), Math.ceil(Math.random() * 60), 0)
        chats.push({
          UserId,
          content: faker.lorem.sentence(Math.floor(Math.random() * 11) + 5).slice(0, 140),
          createdAt: date,
          updatedAt: date
        })
      }
      await queryInterface.bulkInsert('Chatpublics', chats)
    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('Chatpublics', {})
    } catch (error) {
      console.log(error)
    }
  }
};
