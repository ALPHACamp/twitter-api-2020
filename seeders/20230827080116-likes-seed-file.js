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
    const likes = []
    // 每名user新增三則喜歡且不重複的推文
    users.forEach(user => {
      // 檢查單一使用者喜歡的(tweetId)名單
      const existingTweetIds = likes.filter(item => item.UserId === user.id).map(item => item.TweetId)
      for (let i = 0; i < 3; i++) {
        let randomTweetId = tweets[Math.floor(Math.random() * tweets.length)].id
        // 如果有重複喜歡的tweet的話，就重新再跑一次random
        while (existingTweetIds.includes(randomTweetId)) { randomTweetId = tweets[Math.floor(Math.random() * tweets.length)].id }
        likes.push({
          UserId: user.id,
          TweetId: randomTweetId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    })
    await queryInterface.bulkInsert('Likes', likes)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
