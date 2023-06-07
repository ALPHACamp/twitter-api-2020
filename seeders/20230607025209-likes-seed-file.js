'use strict'
const DEFAULT_EACH_USER_LIKES = 10

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const totalLikes = users.length * DEFAULT_EACH_USER_LIKES

    await queryInterface.bulkInsert('Likes',
      Array.from({ length: totalLikes }, (_, index) => ({
        // 預設每個user有10個 likes
        UserId: users[Math.floor(index / DEFAULT_EACH_USER_LIKES)].id,
        TweetId: tweets[Math.floor(Math.random() * tweets.length)].id,
        createdAt: new Date(),
        updatedAt: new Date()
      })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
