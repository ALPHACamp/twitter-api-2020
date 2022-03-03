'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id, name, createdAt FROM Users where role = 'user';", {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const insertedTweets = users.map(user => {
      return Array.from({ length: 10 }, () => ({
        UserId: user.id,
        description: `${user.name} said: ${faker.lorem.text().substring(1, 50)}`,
        createdAt: new Date(+(user.createdAt) + Math.floor(Math.random() * 1000000000)), // add 10^9 milisecond from tweet createdAt date
        updatedAt: new Date()
      }))
    }).flat()
    await queryInterface.bulkInsert('Tweets', insertedTweets)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
