'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT * FROM Users WHERE `role` <> 'admin'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const usersTweets = []
    await users.forEach(user => usersTweets.push(
      ...Array.from({ length: 10 }, () => ({
        UserId: user.id,
        description: faker.lorem.text().substring(0, 140),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    ))
    await queryInterface.bulkInsert('Tweets', usersTweets)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
