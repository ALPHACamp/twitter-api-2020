'use strict'
const NumOfLikePerUser = 20 // 每個User隨機產生Like數

const { QueryTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 取出所有user id及tweet id存於陣列
    const [users, tweets] = await Promise.all([
      queryInterface.sequelize.query("SELECT id FROM Users where `role`='user'", { type: QueryTypes.SELECT }),
      queryInterface.sequelize.query('SELECT id FROM Tweets', { type: QueryTypes.SELECT })
    ])
    const userIds = users.map(user => user.id)
    const tweetIds = tweets.map(tweet => tweet.id)

    // 每一個user隨機產生likes,要去重複
    const likes = []
    for (let i = 0; i < userIds.length; i++) {
      for (let j = 0; j < NumOfLikePerUser; j++) {
        likes.push({
          UserId: userIds[i],
          TweetId: tweetIds[Math.floor(Math.random() * tweetIds.length)], // 從所有tweet id中隨機取一個,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }
    // 去重複: 利用Map去除UserID和TweetId同時一致的
    const uniqLikes = [...new Map(likes.map(v => [JSON.stringify([v.UserId, v.TweetId]), v])).values()]

    await queryInterface.bulkInsert('Likes', uniqLikes)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
