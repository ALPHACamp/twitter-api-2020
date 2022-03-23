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

    // Update users' and tweets' liked data
    const likedTweetData = await queryInterface.sequelize.query(
      `
        SELECT
            count(id) as likedCount,
            TweetId
        FROM (
          SELECT 
            likes.id,
            likes.UserId,
            likes.TweetId,
            tweets.UserId AS TweetUserId
          FROM likes
          JOIN tweets ON TweetId = tweets.id
        ) AS likes
        GROUP BY TweetId;
      `,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const likedUserData = await queryInterface.sequelize.query(
      `
        SELECT
            count(id) as likedCount,
            TweetUserId
        FROM (
          SELECT 
            likes.id,
            likes.UserId,
            likes.TweetId,
            tweets.UserId AS TweetUserId
          FROM likes
          JOIN tweets ON TweetId = tweets.id
        ) AS likes
        GROUP BY TweetUserId;
      `,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    for (const data of likedTweetData) {
      await queryInterface.sequelize.query(
        `
          UPDATE Tweets
          SET likedCount = ${data.likedCount}
          WHERE id = ${data.TweetId}
        `
      )
    }

    for (const data of likedUserData) {
      await queryInterface.sequelize.query(
        `
          UPDATE Users
          SET likedCount = ${data.likedCount}
          WHERE id = ${data.TweetUserId}
        `
      )
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
