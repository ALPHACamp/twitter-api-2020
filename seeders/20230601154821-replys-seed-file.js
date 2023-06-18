'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user";',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert(
      'Replies',
      Array.from(tweets, tweet =>
        Array.from(
          // 每篇 tweet 有隨機 3 個留言者 (shuffule)
          [...users].sort(() => Math.random() - 0.5).slice(0, 3),
          // 每個人有 1 則留言
          user => ({
            comment: faker.lorem.sentence(),
            UserId: user.id,
            TweetId: tweet.id,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        )
      ).flat()
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
