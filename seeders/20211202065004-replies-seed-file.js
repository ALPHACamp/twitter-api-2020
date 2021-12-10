'use strict'
const faker = require('faker')
const { randomDate } = require('../_helpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userId = [11, 21, 31, 41, 51]
    await queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 150 }).map((_, index) => ({
        id: index * 10 + 1,
        UserId: userId[Math.floor(Math.random() * 5)],
        TweetId: Math.floor(index / 3) * 10 + 1,
        comment: faker.lorem.sentence().substring(0, 100),
        createdAt: randomDate(
          new Date(2021, 11, 4),
          new Date(2021, 11, 8),
          0,
          24
        ),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
