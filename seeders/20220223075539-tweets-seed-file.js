'use strict'
const faker = require('faker')
const TWEET_AMOUNT = 10

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role='user'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Tweets',
      users.flatMap(user => {
        return Array.from({ length: TWEET_AMOUNT }, () => ({
          UserId: user.id,
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      })
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
