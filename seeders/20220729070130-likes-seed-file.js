'use strict'
const { randomPick } = require('../helpers/seeder-helper')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const seedLikes = []
    tweets.forEach(tweet => {
      // every tweet has random (0 to total number of users) likes, including tweet author him/herself
      const randomNumberOfLikes = Math.floor(Math.random() * (users.length + 1))
      const randomLikeUsers = randomPick(users, randomNumberOfLikes)
      const userLikes = randomLikeUsers.map(user => ({
        UserId: user.id,
        TweetId: tweet.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      seedLikes.push(...userLikes)
    })

    await queryInterface.bulkInsert('Likes', seedLikes)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {}, { truncate: true })
  }
}
