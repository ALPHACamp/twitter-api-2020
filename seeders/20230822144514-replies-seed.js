'use strict'

const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    let tweetsList = []
    for (let i = 1; i <= 3; i++) {
      tweetsList = tweetsList.concat(tweets)
    }

    await queryInterface.bulkInsert('Replies',
      tweetsList.map(tweet => ({
        UserId: users[Math.floor(Math.random() * users.length)].id,
        TweetId: tweet.id,
        comment: faker.string.alphanumeric({ length: { min: 1, max: 140 } }),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
