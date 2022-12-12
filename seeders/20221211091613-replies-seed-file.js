'use strict'
const faker = require('faker')
const { generateRandomNumArr } = require('../helpers/random-generate-helper')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DEFAULT_REPLIES_NUMBER = 3
    const users = await queryInterface.sequelize.query("SELECT id FROM Users WHERE `role` <> 'admin'", { type: queryInterface.sequelize.QueryTypes.SELECT })
    const tweets = await queryInterface.sequelize.query('SELECT id FROM Tweets', { type: queryInterface.sequelize.QueryTypes.SELECT })
    let replies = []

    tweets.forEach(tweet => {
      const randomUserIndexes = generateRandomNumArr(users.length, DEFAULT_REPLIES_NUMBER)
      replies = replies.concat(randomUserIndexes.map(userIndex => ({
        UserId: users[userIndex].id,
        TweetId: tweet.id,
        comment: faker.lorem.sentence(3),
        createdAt: new Date(),
        updatedAt: new Date()
      })))
    })
    await queryInterface.bulkInsert(
      'Replies',
      replies,
      {}
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
