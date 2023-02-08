'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const REPLIES_PER_TWEET = 3
    const MIN_REPLIES_PER_USER = 1
    const DEFAULT_RANDOM_NUM = 0
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role='user'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const replies = []
    users.forEach(user => {
      replies.push(
        ...Array.from({ length: MIN_REPLIES_PER_USER }, () => ({
          UserId: user.id,
          TweetId: tweets[Math.floor(Math.random() * tweets.length)].id,
          comment: faker.lorem.sentence(3),
          createdAt: faker.date.between('2022-09-16T00:00:00.000Z', '2022-10-01T00:00:00.000Z'),
          updatedAt: new Date()
        }))
      )
    })
    tweets.forEach(tweet => {
      const userArr = []
      replies.push(
        ...Array.from({ length: REPLIES_PER_TWEET }, () => {
          let UserId = DEFAULT_RANDOM_NUM
          do {
            UserId = users[Math.floor(Math.random() * users.length)].id
          } while (UserId === tweet.UserId || userArr.includes(UserId))
          userArr.push(UserId)
          return {
            UserId,
            TweetId: tweet.id,
            comment: faker.lorem.sentence(3),
            createdAt: faker.date.between('2022-09-16T00:00:00.000Z', '2022-10-01T00:00:00.000Z'),
            updatedAt: new Date()
          }
        }))
    })
    await queryInterface.bulkInsert('Replies', replies, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
