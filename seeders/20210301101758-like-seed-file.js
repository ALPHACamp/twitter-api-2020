'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const likes = Array.from({ length: 30 }).map((item, index) =>
      ({
        UserId: Math.floor(Math.random() * 8) + 1,
        TweetId: Math.floor(Math.random() * 30) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    )
    await queryInterface.bulkInsert('Likes', likes)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
