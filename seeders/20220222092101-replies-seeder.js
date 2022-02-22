'use strict'
const faker = require('faker')
const { randomPicks } = require('../helpers/seeds')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Select users
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // Select existing tweets
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const replies = []
    tweets.forEach(tweet => {
      const randomUsers = randomPicks(users, 3)
      const randomReplies = randomUsers.map((user, _index) => ({
        UserId: user.id,
        TweetId: tweet.id,
        comment: faker.lorem.sentence()
      }))

      replies.push(...randomReplies)
    })

    await queryInterface.bulkInsert('Replies', replies, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
