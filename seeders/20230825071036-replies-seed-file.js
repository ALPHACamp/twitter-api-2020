'use strict'
const { User, Tweet } = require('../models')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先確認User資料庫有多少個用戶，只取id和role
    let users = await User.findAll({
      attributes: ['id', 'role'],
      raw: true
    })
    // 只保留使用者，剃除管理者
    users = users.filter(user => user.role === 'user')
    // 尋找所有推文，只取id
    const tweets = await Tweet.findAll({
      attributes: ['id'],
      raw: true
    })
    // tweets
    const replies = []
    tweets.forEach(tweet => {
      for (let i = 0; i < 3; i++) {
        replies.push({
          TweetId: tweet.id,
          UserId: users[Math.floor(Math.random() * users.length)].id,
          comment: `reply ${i + 1}`,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    })
    await queryInterface.bulkInsert('replies', replies
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('replies', {})
  }
}
