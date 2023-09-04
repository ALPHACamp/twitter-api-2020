'use strict'
const { User } = require('../models')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先確認User資料庫有多少個用戶
    let users = await User.findAll({
      attributes: ['id', 'account', 'role'],
      raw: true
    })
    // 只保留使用者，剃除管理者
    users = users.filter(user => user.role === 'user')
    // tweets
    const tweets = []
    users.forEach(user => {
      for (let i = 0; i < 10; i++) {
        tweets.push({
          UserId: user.id,
          description: `${user.account}'s Tweet ${i + 1}`,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    })
    await queryInterface.bulkInsert('Tweets', tweets
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
