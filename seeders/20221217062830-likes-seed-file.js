'use strict'
const LIKES_PER_USERS = 10

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersIdArr = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = \'user\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT `id`, `UserId` FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const likes = []
    usersIdArr.forEach(userIdObj => {
      const tweetIdCheckRepeatArr = []
      let TweetId
      likes.push(
        ...Array.from({ length: LIKES_PER_USERS }).map(() => {
          do {
            TweetId = tweets[Math.floor(Math.random() * tweets.length)].id
          } while (TweetId === tweets[0].id || tweetIdCheckRepeatArr.includes(TweetId))
          tweetIdCheckRepeatArr.push(TweetId)
          return ({
            UserId: userIdObj.id,
            TweetId,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        })
      )
    })
    await queryInterface.bulkInsert('Likes', likes, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
