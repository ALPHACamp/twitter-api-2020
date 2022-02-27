'use strict'

const DEFAULT_COUNT = 2

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
    const checkArray = Array.from({ length: users.length }).map((_, i) => [])

    await queryInterface.bulkInsert('Likes',
      Array.from({ length: users.length * DEFAULT_COUNT }).map((_, i) => {
        // const UserId = Math.floor(Math.random() * users.length)
        const UserId = Math.floor(i / DEFAULT_COUNT)
        let TweetId = Math.floor(Math.random() * tweets.length)
        while (checkArray[UserId].includes(TweetId)) {
          TweetId = Math.floor(Math.random() * tweets.length)
        }
        checkArray[UserId].push(TweetId)
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
