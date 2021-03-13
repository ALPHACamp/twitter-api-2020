'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Likes',
      [{
        id: 1,
        UserId: 11,
        TweetId: 11,
        createdAT: new Date(),
        updatedAt: new Date()
      },
      {
        id: 11,
        UserId: 21,
        TweetId: 21,
        createdAT: new Date(),
        updatedAt: new Date()
      }
      ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
