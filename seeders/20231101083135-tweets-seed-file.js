'use strict'

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
      for (let i = 0; i < 10; i++) {
        const tweetData = {
          UserId: user.id, // 將推文與特定用戶關聯
          description: `Tweet ${i} by User ${user.id}`, // 預設推文內容
          createdAt: new Date(),
          updatedAt: new Date()
        }
        tweetsData.push(tweetData)
      }
    }

    await queryInterface.bulkInsert('Tweets', tweetsData, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
