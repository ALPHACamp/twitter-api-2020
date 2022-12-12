'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DEFAULT_TWEETS_NUMBER = 10
    const users = await queryInterface.sequelize.query("SELECT id FROM Users WHERE `role` <> 'admin'", { type: queryInterface.sequelize.QueryTypes.SELECT })
    const tweets = []
    users.forEach(user => {
      tweets.push(...Array.from({ length: DEFAULT_TWEETS_NUMBER }, () => ({
        UserId: user.id,
        description: faker.lorem.sentence(5),
        createdAt: new Date(),
        updatedAt: new Date()
      })))
    })
    await queryInterface.bulkInsert(
      'Tweets',
      tweets,
      {}
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
