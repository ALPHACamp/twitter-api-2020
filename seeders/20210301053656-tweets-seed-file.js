'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (let i = 1; i <= 5; i++) {
      await queryInterface.bulkInsert('Tweets',
        Array.from({ length: 10 }).map((_, index) =>
        ({
          UserId: i,
          description: faker.lorem.sentence(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ), {})
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
