'use strict'

const faker = require('faker')
// user_id, tweet_id,comment, created_at, updated_at
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id, user_id FROM Tweets;',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const repliesCollection = []

    tweets.forEach((tweet, index) => {
      // 用來 check 該篇推文的 user id 是否出現過
      const checkUserReply = []
      // 該篇推文的 user id
      const userId = tweet.user_id

      // 每篇tweet隨機 3 個 user 留言
      for (let i = 0; i < 3; i++) {
        // 把出現過的 user id 存起來
        checkUserReply.push(users[Math.floor(Math.random() * users.length)].id)

        repliesCollection.push({
          user_id: users[Math.floor(Math.random() * users.length)].id,
          tweet_id: tweet.id,
          comment: faker.lorem.sentence(),
          created_at: new Date(),
          updated_at: new Date()
        })
      }
      // 若該篇推文的 user id未出現， 就新增一筆推文
      if (!checkUserReply.includes(userId)) {
        repliesCollection.push({
          user_id: userId,
          tweet_id: tweet.id,
          comment: faker.lorem.sentence(),
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    })

    await queryInterface.bulkInsert('Replies', repliesCollection, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
