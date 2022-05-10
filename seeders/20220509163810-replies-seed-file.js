'use strict'

const faker = require('faker')
const { randomPick } = require('../helpers/seed-random-pick')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const tweets = await queryInterface.sequelize.query(
      "SELECT id FROM Tweets;",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const replyList = []

    
    tweets.forEach(tweet => {
      // Pick randomly 3 users to leave replies in 1 tweets
      const pickecUsers = randomPick(users, 3)

      const reply = pickecUsers.map(user => ({
        user_id: user.id,
        tweet_id: tweet.id,
        comment: faker.lorem.sentence(),
        created_at: new Date(),
        updated_at: new Date()
      }))

      replyList.push(...reply)
    })

    await queryInterface.bulkInsert('Replies', replyList, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
