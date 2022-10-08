'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const tweets = await queryInterface.sequelize.query('SELECT id FROM Tweets;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    await queryInterface.bulkInsert('Replies', Array.from({ length: 180 }, (_, i) => ({
      user_id: users[Math.floor(Math.random() * users.length)].id, // 每篇貼文有3個使用者隨機留言
      tweet_id: tweets[(i % tweets.length)].id, // 每篇貼文有3個留言
      comment: faker.lorem.text(),
      created_at: new Date(),
      updated_at: new Date()
    })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
