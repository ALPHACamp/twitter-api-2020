'use strict'
const faker = require('faker')
const DEFAULT_TWEETS_FOR_EACH_PERSON = 10
const TWEETS_WORD_LIMIT = 140

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userData = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // 預設一人10篇tweets
    const tweetsSeeder = []

    userData.forEach(user => {
      for (let i = 0; i < DEFAULT_TWEETS_FOR_EACH_PERSON; i++) {
        tweetsSeeder.push({
          UserId: user.id,
          description: faker.lorem.sentence().substring(0, TWEETS_WORD_LIMIT),
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent()
        })
      }
    })
    await queryInterface.bulkInsert('tweets', tweetsSeeder)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tweets', {})
  }
}
