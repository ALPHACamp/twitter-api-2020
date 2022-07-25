'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    users.shift()

    await queryInterface.bulkInsert('Likes',
      Array.from({ length: users.length * 4 }).map((_, index) => {
        const UserId = Math.floor(index / 4)
        let TweetId = Math.floor(Math.random() * tweets.length)
        const likes = {}
        while (likes.UserId === TweetId) {
          TweetId = Math.floor(Math.random() * tweets.length)
        }
        likes.UserId = TweetId
        return {
          UserId: users[UserId].id,
          TweetId: tweets[TweetId].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
