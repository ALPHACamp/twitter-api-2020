'use strict'
const faker = require('faker')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DEFAULT_REPLY_COUNT = 3
    const users = (await User.findAll({ where: { role: 'user' } })).map(user => user.id)
    const tweets = (await Tweet.findAll()).map(tweet => tweet.id)

    // 建立3則Reply，每個留言者皆不同
    await Promise.all(tweets.map(tweetId => {
      const replySeeder = Array.from({ length: DEFAULT_REPLY_COUNT }, (_, i) => {
        return {
          UserId: users[Math.floor(Math.random() * users.length)],
          tweetId: tweetId,
          comment: faker.lorem.sentence(3),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      return queryInterface.bulkInsert('Replies', replySeeder)
    }))

    // 更新 DB 推文的留言數
    await Promise.all(tweets.map(tweetId => {
      const SQL = `UPDATE Tweets SET replyCount = 3 WHERE id = ${tweetId}`
      return queryInterface.sequelize.query(SQL)
    }))
  },

  down: async (queryInterface, Sequelize) => {
    const tweets = (await Tweet.findAll()).map(tweet => tweet.id)

    // 重設replyCount
    tweets.forEach(async id => {
      const SQL = `UPDATE Tweets SET replyCount = 0 WHERE id = ${id}`
      await queryInterface.sequelize.query(SQL)
    })
    await queryInterface.bulkDelete('Replies', null)
  }
}
