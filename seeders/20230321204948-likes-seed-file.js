'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userLikesCounts = 10
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const totalLikes = users.length * userLikesCounts

    await queryInterface.bulkInsert(
      'Likes',
      Array.from({ length: totalLikes }, (_, index) => ({
        User_id: users[Math.floor(index / userLikesCounts)].id,
        Tweet_id: tweets[Math.floor(Math.random() * tweets.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
