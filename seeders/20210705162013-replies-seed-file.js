'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((d, i) => ({
        id: i + 1,
        UserId: Math.floor(Math.random() * 5) + 2, // id 2~6 的隨機使用者
        TweetId: i % 50 + 1, // id 1~50 的推文各3個回覆
        comment: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
