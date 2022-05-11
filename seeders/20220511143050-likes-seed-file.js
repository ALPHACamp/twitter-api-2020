'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Likes',
      Array.from({ length: 25 }).map((item, index) => ({
        id: index + 1,
        user_id: Math.ceil(Math.random() * 9) + 1,
        tweet_id: Math.ceil(Math.random() * 100),
        created_at: new Date(),
        updated_at: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  },
}
