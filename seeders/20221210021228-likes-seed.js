'use strict'
const { LIKE_AMOUNT } = require('../helpers/seeder-helper')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT `id` FROM `Users` WHERE `role` = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT `id`, `UserId` FROM `Tweets`;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const likes = []
    do {
      let UserId
      let TweetId
      do {
        UserId = users[Math.floor(Math.random() * users.length)].id
        TweetId = tweets[Math.floor(Math.random() * tweets.length)].id
      } while (likes.join('、').includes(`${UserId},${TweetId}`))
      likes.push([UserId, TweetId])
    } while (likes.length < LIKE_AMOUNT)
    await queryInterface.bulkInsert('Likes',
      Array.from({ length: LIKE_AMOUNT }, (_, i) => {
        return ({
          UserId: likes[i][0],
          TweetId: likes[i][1],
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', { })
  }
}
