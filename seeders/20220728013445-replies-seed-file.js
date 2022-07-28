'use strict'
const faker = require('faker')
const { randomPick } = require('../helpers/seeder-helper')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // get users (admin not included)
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // get all tweets
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const seedReplies = []
    // for each tweet, randomly pick 3 users and leave 1 reply per user
    tweets.forEach(tweet => {
      const randomUsers = randomPick(users, 3)
      const randomReplies = randomUsers.map(user => ({
        UserId: user.id,
        TweetId: tweet.id,
        comment: faker.lorem.words(),
        createdAt: faker.date.recent(30),
        updatedAt: new Date()
      }))
      seedReplies.push(...randomReplies)
    })

    await queryInterface.bulkInsert('Replies', seedReplies)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {}, { truncate: true })
  }
}
