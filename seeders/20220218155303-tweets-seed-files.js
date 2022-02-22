'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 50 }).map((tweet, i) => ({
        id: i * 10 + 1,
        userId: Math.ceil((i + 1) / 10) * 10 + 1,
        description: faker.lorem.text().substring(0, 140),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
