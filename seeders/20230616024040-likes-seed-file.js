'use strict'
const { Tweet, User } = require('../models')
const tweetCount = 10 // 每個 user 10 個 tweets
const userCount = 5 // 有 5 個 users
const likeCount = 3 // 每篇post 3人按讚

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' } }) // 避免資料庫 id 跳號
    const tweets = await Tweet.findAll({ attributes: ['id'] })

    await queryInterface.bulkInsert(
      'Likes',
      Array.from({ length: tweetCount * userCount * likeCount }).map((_, i) => ({
        TweetId: tweets[Math.floor(i / 3)].id,
        UserId: users[Math.floor(i % 5)].id,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Likes', null, {})
  }
}
