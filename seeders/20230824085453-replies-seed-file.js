'use strict'
const { faker } = require('@faker-js/faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 使用SQL查詢Users裡role:user的id
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // 使用SQL查詢Tweets
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const repliesToInsert = []

    // 每個tweet新增3為隨機使用者留言
    tweets.forEach(tweet => {
      for (let i = 0; i < 3; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)]
        const replyData = {
          TweetId: tweet.id,
          UserId: randomUser.id,
          comment: faker.lorem.sentence(),
          createdAt: new Date(),
          updatedAt: new Date()
        }

        repliesToInsert.push(replyData)
      }
    })

    await queryInterface.bulkInsert('Replies', repliesToInsert, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
