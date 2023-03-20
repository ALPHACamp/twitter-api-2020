'use strict'

const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE role = \'user\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const repliesPerTweet = 3
    let totalTweets = []
    let totalUsers = [...users]
    for (let i = 0; i < repliesPerTweet; i++) {
      totalTweets = totalTweets.concat(tweets)
    }
    for (let i = 0; i < totalTweets.length - users.length; i++) {
      const index = Math.floor(Math.random() * users.length)
      totalUsers = totalUsers.concat(users[index])
    }
    // 配對 totalTweets & totalUsers 這兩組陣列
    const replies = totalTweets.map((tweet, i) => ({
      UserId: totalUsers[i].id,
      TweetId: tweet.id,
      comment: faker.lorem.words(140),
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    await queryInterface.bulkInsert('Replies', replies)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
