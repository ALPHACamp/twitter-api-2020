'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DEFAULT_TWEETS_PER_PERSON = 10
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const seedTweets = []
    users.forEach(user => {
      const seed = Array.from({ length: DEFAULT_TWEETS_PER_PERSON }, (_, i) => ({
        description: faker.lorem.sentence().substring(0, 140),
        User_id: user.id,
        created_at: faker.date.between('2020-01-01T00:00:00.000Z', '2023-03-01T00:00:00.000Z'),
        updated_at: faker.date.between('2023-03-01T00:00:00.000Z', '2023-03-20T00:00:00.000Z')
      }))
      seedTweets.push(...seed)
    })
    await queryInterface.bulkInsert('Tweets', seedTweets)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
