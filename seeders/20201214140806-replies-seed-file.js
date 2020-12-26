'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 150 }).map((d, i) => ({
        id: i * 10 + 1,
        comment: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
        UserId: (i % 5) * 10 + 11,
        TweetId: Math.floor(i / 3) * 10 + 1
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
