'use strict'
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 從資料庫找到所有用戶
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      {
        type: Sequelize.QueryTypes.SELECT
      }
    )

    // 生成 50 筆隨機的推文資料，每位用戶 10 筆
    const tweetsData = []
    for (const user of users) {
      for (let i = 1; i < 11; i++) {
        const createdAt = new Date()
        createdAt.setDate(createdAt.getDate() - i) // 每則推文各差一天

        const tweetData = {
          UserId: user.id, // 將推文與特定用戶關聯
          description: faker.lorem
            .paragraph({ min: 1, max: 3 })
            .substring(0, 140), // 預設推文內容
          createdAt,
          updatedAt: createdAt
        }
        tweetsData.push(tweetData)
      }
    }

    await queryInterface.bulkInsert('Tweets', tweetsData, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
