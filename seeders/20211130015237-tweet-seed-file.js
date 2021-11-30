'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const mockTweets = []

    for (let i = 0; i < 5; i++) {
      for (let j = 1; j < 11; j++) {
        const tweet = {
          id: i * 10 + j,
          description: faker.lorem.words(),
          createdAt: new Date(),
          updatedAt: new Date(),
          UserId: i + 2
        }
        mockTweets.push(tweet)
      }
    }
    await queryInterface.bulkInsert('Tweets', mockTweets)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
