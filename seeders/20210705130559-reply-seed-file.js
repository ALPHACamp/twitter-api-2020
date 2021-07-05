'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((item, index) => ({
        id: index + 1,
        UserId: Math.ceil(Math.random() * 5),
        TweetId: Math.ceil((index + 1) / 3),
        comment: faker.lorem.text().substring(0, 50),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
