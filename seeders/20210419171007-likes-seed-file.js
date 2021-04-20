'use strict'

module.exports = {

  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Likes',
      [
        {
          id: 1,
          UserId: 1,
          TweetId: 11,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          UserId: 2,
          TweetId: 21,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
