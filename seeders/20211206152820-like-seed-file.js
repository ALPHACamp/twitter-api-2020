'use strict'

const { randomDate } = require('../_helpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Likes',
      Array.from({ length: 50 }).map((_, index) => ({
        id: index * 10 + 1,
        UserId: Math.ceil((index + 1) / 10) * 10 + 1,
        TweetId: Math.floor(Math.random() * 49) * 10 + 1,
        createdAt: randomDate(
          new Date(2021, 11, 5),
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
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
