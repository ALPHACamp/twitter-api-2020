'use strict'
const { faker } = require('@faker-js/faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 找到所有推文
    const tweets = await queryInterface.sequelize.query('SELECT id FROM Tweets;', {
      type: Sequelize.QueryTypes.SELECT
    })

    // 生成留言資料
    const repliesData = []
    for (const tweet of tweets) {
      // 隨機選擇三個留言者的用戶 ID
      const commentUserIds = await queryInterface.sequelize.query(
        'SELECT id FROM `Users` ORDER BY RAND() LIMIT 3;',
        {
          type: Sequelize.QueryTypes.SELECT
        }
      )

      for (const commentUserId of commentUserIds) {
        const replyData = {
          UserId: commentUserId.id, // 留言者的用戶 ID
          TweetId: tweet.id, // 推文的 ID
          comment: faker.string.alphanumeric({
            length: { min: 1, max: 140 }
          }), // 預設留言內容
          createdAt: new Date(),
          updatedAt: new Date()
        }
        repliesData.push(replyData)
      }
    }

    await queryInterface.bulkInsert('Replies', repliesData, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
