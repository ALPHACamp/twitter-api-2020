'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (let i = 1; i <= 50; i++) {
      await queryInterface.bulkInsert('Replies',
        Array.from({ length: 3 }).map((d, index) => ({
          comment: faker.lorem.sentence(),
          UserId: Math.floor(Math.random() * 5) + 1,
          TweetId: i,
          createdAt: new Date(),
          updatedAt: new Date()
        })), {})
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
