'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const replyAmount = tweets.length * 3

    await queryInterface.bulkInsert('Replies',
      Array.from({ length: replyAmount }, (_, i) => ({
        comment: faker.lorem.text(),
        user_id: users[Math.floor(Math.random() * users.length)].id,
        tweet_id: tweets[i % tweets.length].id,
        created_at: new Date(Date.now() + i * 1000),
        updated_at: new Date(Date.now() + i * 1000)
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
