'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const TWEETS_PER_USERS = 10
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role='user'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = []
    users.forEach(user => {
      tweets.push(...Array.from({ length: TWEETS_PER_USERS }, () => ({
        UserId: user.id,
        description: faker.lorem.sentence(6),
        createdAt: faker.date.between('2022-09-01T00:00:00.000Z', '2022-10-01T00:00:00.000Z'),
        updatedAt: new Date()
      })))
    })
    await queryInterface.bulkInsert('Tweets', tweets, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
