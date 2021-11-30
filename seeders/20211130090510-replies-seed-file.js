'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 350 }).map((d, i) => ({
        id: i + 1,
        UserId: Math.ceil((i + 1) / 3),
        TweetId: Math.ceil((i + 1) / 7),
        comment: faker.lorem.text().substring(0, 140),
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
