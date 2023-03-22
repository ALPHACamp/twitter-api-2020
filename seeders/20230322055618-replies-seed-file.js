'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 新增以下6行，先去查詢現在 id 有哪些
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE is_admin = 0;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Replies',
      Array.from({ length: tweets.length * 3 }, (_, i) => ({
        comment: faker.lorem.text(),
        user_id: users[Math.floor(Math.random() * users.length)].id, // 若要 "不重複的 3 人"，之後再修
        tweet_id: tweets[i % tweets.length].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
