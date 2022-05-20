'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const tweets = []
    users.forEach(user => {
      tweets.push(...Array.from({ length: 10 }, () => ({
        UserId: user.id,
        description: faker.lorem.text().substring(0, 30),
        createdAt: faker.date.recent(),
        updatedAt: new Date()
      })))
    })

    await queryInterface.bulkInsert('Tweets', tweets, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
