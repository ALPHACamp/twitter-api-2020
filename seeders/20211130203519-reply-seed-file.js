'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 50 }).map((d, i) => ({
        comment: faker.lorem.sentences(),
        UserId: Math.floor(1 + Math.random() * 5) + 1,
        TweetId: Math.floor(Math.random() * 49) + 1,
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
