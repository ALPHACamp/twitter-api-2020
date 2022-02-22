'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const tweets = []
    users.forEach((user, _index) => {
      // Each user has 10 tweets
      const userTweets = Array.from({ length: 10 }, () => ({
        UserId: user.id,
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      tweets.push(...userTweets)
    })

    await queryInterface.bulkInsert('Tweets', tweets, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
