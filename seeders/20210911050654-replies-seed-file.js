'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 150 }).map((reply, index) => ({
        id: index * 10 + 5,
        comment: faker.lorem.sentence(),
        userId: ((index % 3) + 1) * 10 + 5,
        tweetId: Math.floor(index / 3) * 10 + 5,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, { truncate: true })
  }
}
