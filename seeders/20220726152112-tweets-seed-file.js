'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const seedTweets = []
    users.forEach(user => {
      const userTweets = Array.from({ length: 10 }, () => ({
        UserId: user.id,
        description: faker.lorem.sentences().substring(0, 140),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      seedTweets.push(...userTweets)
    })
    await queryInterface.bulkInsert('Tweets', seedTweets)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
