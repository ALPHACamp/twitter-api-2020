'use strict'

const { randomPicks } = require('../helpers/seeds')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Each user have five random likes to tweets
    // Select users
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const likes = []

    tweets.forEach(tweet => {
      const randomUsers = randomPicks(users, 2)
      const userlikes = randomUsers.map(user => ({
        UserId: user.id,
        TweetId: tweet.id
      }))
      likes.push(...userlikes)
    })

    await queryInterface.bulkInsert('Likes', likes, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
