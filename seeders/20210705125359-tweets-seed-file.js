'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((d, i) => ({
        id: i + 1,
        UserId: i % 5 + 2, // id 2~6 的一般使用者各10篇
        content: faker.lorem.sentence(),
        replyCounts: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
