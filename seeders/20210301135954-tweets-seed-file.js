'use strict';
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 50 }).map((d, i) => ({
        UserId: Math.floor(i / 10) + 2, //暫定2~6 //UserId 為 1 ,11 ,21 ,31 ,41
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {});
  },
};
