'use strict'
const faker = require('faker')
const { randomDate } = require('../_helpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 50 }).map((_, index) => ({
        id: index * 10 + 1,
        UserId: Math.ceil((index + 1) / 10) * 10 + 1,
        description: faker.lorem.sentence().substring(0, 140),
        createdAt: randomDate(
          new Date(2021, 11, 1),
          new Date(2021, 11, 4),
          0,
          24
        ),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
