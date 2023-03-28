'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 取使用者id
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = \'user\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // 取推文id
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets ;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // 每則推文
    for (const tweet of tweets) {
      const replies = []
      // 生成3個留言
      for (let i = 0; i < 5; i++) {
        // 以do-while確保使用者不同
        let randomUserId
        do {
          randomUserId = users[Math.floor(Math.random() * users.length)].id
        } while (replies.some(reply => reply.UserId === randomUserId)) // 若已存在則再次隨機
        replies.push({
          UserId: randomUserId,
          TweetId: tweet.id,
          comment: faker.lorem.text().substring(0, 140),
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          UserId: randomUserId,
          TweetId: tweet.id,
          comment: faker.lorem.text().substring(0, 140),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
      // 建立留言
      await queryInterface.bulkInsert('Replies', replies)
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
