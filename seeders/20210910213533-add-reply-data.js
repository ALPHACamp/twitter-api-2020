'use strict';
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('replies',
      Array.from({ length: 150 }).map((item, index) =>
      ({
        UserId: [2, 3, 4, 5, 6][(Math.floor(Math.random() * 5))],
        TweetId: index % 50 + 1,
        comment: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      )
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('replies', null, {})
  }
};
