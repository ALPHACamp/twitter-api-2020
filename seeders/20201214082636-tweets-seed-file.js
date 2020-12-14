'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((d, i) =>
        ({
          id: i * 10 + 1,
          UserId: Math.floor(Math.random() * 5) + 2,
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
