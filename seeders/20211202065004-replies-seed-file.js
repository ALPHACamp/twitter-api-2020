'use strict'
const faker = require('faker')

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
