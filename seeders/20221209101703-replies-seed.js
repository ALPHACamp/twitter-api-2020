'use strict'
const faker = require('faker')
const { REPLIES_PER_TWEET } = require('../helpers/seeder-helper')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const replies = []
    const users = await queryInterface.sequelize.query(
      'SELECT `id` FROM `Users` WHERE `role` = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT `id`, `UserId` FROM `Tweets`;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    tweets.forEach(tweet => {
      const userIdArr = []
      let UserId
      replies.push(
        ...Array.from({ length: REPLIES_PER_TWEET }, () => {
          do {
            UserId = users[Math.floor(Math.random() * users.length)].id
          } while (UserId === tweet.UserId || userIdArr.includes(UserId))
          userIdArr.push(UserId)
          return ({
            UserId,
            TweetId: tweet.id,
            comment: faker.lorem.sentences(2),
            createdAt: new Date(),
            updatedAt: new Date()
          })
        })
      )
    })
    await queryInterface.bulkInsert('Replies', replies)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', { })
  }
}
