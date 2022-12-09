'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersId = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const seedTweets = []
    usersId.forEach(userId => {
      const seedTweet = Array.from({ length: 10 }, () => ({
        description: faker.lorem.text().substring(0, 140),
        User_id: userId.id,
        created_at: new Date(),
        updated_at: new Date()
      }))
      seedTweets.push(...seedTweet)
    })
    await queryInterface.bulkInsert('Tweets', seedTweets)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
