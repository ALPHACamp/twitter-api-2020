'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((item, index) =>
      ({
        id: index * 10 + 1,
        UserId: Math.floor(Math.random() * 5) + 2,
        TweetId: (Math.floor(Math.random() * 11) * 10 + 1),
        comment: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
