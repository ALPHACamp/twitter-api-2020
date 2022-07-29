'use strict';
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 150 }).map((d, i) => ({
        UserId: Math.floor(Math.random() * 5) + 2, //隨機2~6    //UserId 為 1 ,11 ,21 ,31 ,41
        TweetId: Math.floor(i / 3) + 1, //
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
