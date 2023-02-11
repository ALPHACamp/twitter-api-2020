'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 預設每篇tweets有3則comment
    const commentsPerTweet = 3
    // 從資料庫取得所有user
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    // 從資料庫取得所有tweet
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    // 所有使用者tweet數總和
    const totalTweets = (tweets.length) * commentsPerTweet

    await queryInterface.bulkInsert('Replies',
      Array.from({ length: totalTweets }, (_, index) =>
        (
          {
            User_id: users[Math.floor(Math.random() * (users.length - 1)) + 1].id,
            Tweet_id: tweets[Math.floor(index / commentsPerTweet)].id,
            comment: faker.lorem.text(),
            created_at: new Date(),
            updated_at: new Date()
          }
        )
      )
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
