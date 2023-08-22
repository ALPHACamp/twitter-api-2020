'use strict'
const NumOfReplyPerTweet = 3 // 每個Tweet隨機產生Reply數

const { QueryTypes } = require('sequelize')
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 取出所有user id及tweet id存於陣列
    const [users, tweets] = await Promise.all([
      queryInterface.sequelize.query("SELECT id FROM Users where `role`='user'", { type: QueryTypes.SELECT }),
      queryInterface.sequelize.query('SELECT id FROM Tweets', { type: QueryTypes.SELECT })
    ])
    const userIds = users.map(user => user.id)
    const tweetIds = tweets.map(tweet => tweet.id)

    // 每一個tweet隨機產生3篇replies
    const replies = []
    for (let i = 0; i < tweetIds.length; i++) {
      for (let j = 0; j < NumOfReplyPerTweet; j++) {
        replies.push({
          UserId: userIds[Math.floor(Math.random() * userIds.length)], // 從所有user id中隨機取一個
          TweetId: tweetIds[i],
          comment: faker.lorem.paragraph({ min: 1, max: 3 }).substring(0, 140),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }

    await queryInterface.bulkInsert('Replies', replies)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
