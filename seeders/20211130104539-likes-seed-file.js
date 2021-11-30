'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Likes',
      Array.from({ length: 200 }).map((d, i) => ({
        id: i + 1,
        UserId: Math.ceil((i + 1) / 20),
        TweetId: Math.floor(Math.random() * 5) + 1 + (5 * i) % 100,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
