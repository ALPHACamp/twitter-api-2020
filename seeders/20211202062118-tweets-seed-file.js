'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 50 }).map((_, index) => ({
        id: index * 10 + 1,
        UserId: Math.ceil((index + 1) / 10) * 10 + 1,
        description: faker.lorem.sentence().substring(0, 140),
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
