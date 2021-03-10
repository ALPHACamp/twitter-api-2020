'use strict';
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 150 }).map((d, i) => ({
        id: i * 10 + 1,
        UserId: Math.floor(Math.random() * 5) * 10 + 11,
        TweetId: Math.floor(i / 3) * 10 + 1,
        Comment: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {});
  },
};