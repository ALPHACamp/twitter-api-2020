'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Likes', [
      {
        user_id: 2,
        tweet_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 3,
        tweet_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        tweet_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
