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

    // Update users' repliedCount
    const userData = await queryInterface.sequelize.query(
      `
      SELECT 
        COUNT(replies.id) AS repliedCount,
        tweets.UserId
      FROM replies
      JOIN tweets ON replies.TweetId = tweets.id
      GROUP BY tweets.UserId;
      `,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    for (const user of userData) {
      await queryInterface.sequelize.query(
        `
        Update Users
        SET repliedCount = ${user.repliedCount}
        WHERE id = ${user.UserId}
        `,
        { type: queryInterface.sequelize.QueryTypes.UPDATE }
      )
    }

    // Update tweets' repliedCount data
    const tweetData = await queryInterface.sequelize.query(
      `
      SELECT 
        COUNT(id) AS repliedCount,
        TweetId
        FROM replies
        GROUP BY TweetId;
      `,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    for (const tweet of tweetData) {
      await queryInterface.sequelize.query(
        `
        Update Tweets
        SET repliedCount = ${tweet.repliedCount}
        WHERE id = ${tweet.TweetId}
        `,
        { type: queryInterface.sequelize.QueryTypes.UPDATE }
      )
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
