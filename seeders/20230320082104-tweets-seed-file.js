'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DEFAULT_TWEETS_AMOUNT = 10
    const usersId = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role="user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const seedTweets = []
    usersId.forEach(userId => {
      const seeds = Array.from({ length: DEFAULT_TWEETS_AMOUNT }, (_, i) => ({
        description: faker.lorem.sentence().substring(0, 140),
        User_id: userId.id,
        create_at: faker.date.recent(50),
        update_at: new Date()
      }))
      seedTweets.push(...seeds)
    })
    await queryInterface.bulkInsert('Tweets', seedTweets, {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
