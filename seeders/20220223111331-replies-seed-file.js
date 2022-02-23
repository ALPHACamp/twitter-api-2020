'use strict'
const faker = require('faker')
const REPLY_AMOUNT = 3

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role='user'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const tweetsArr = tweets.flatMap(tweet => {
      return Array.from({ length: REPLY_AMOUNT }, () => ({
        UserId: users[Math.floor(Math.random() * users.length)].id,
        TweetId: tweet.id,
        comment: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    })
    await queryInterface.bulkInsert('Replies', tweetsArr, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
