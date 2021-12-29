'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 100 }).map((d, i) => ({
        id: i + 1,
        UserId: Math.ceil((i + 1) / 10),
        description: faker.lorem.text().substring(0, 140),
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
