'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = []

    for (let x = 0; x < 5; x++) {
      for (let y = 1; y < 11; y++) {
        tweets.push(
          {
            id: ((10 * x) + y),
            UserId: 10 * (x + 1) + 1,
            description: faker.lorem.words(140),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        )
      }
    }

    await queryInterface.bulkInsert('Tweets', tweets, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
