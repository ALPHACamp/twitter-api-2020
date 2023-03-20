'use strict'
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE role = \'user\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = []
    users.forEach(user => {
      for (let i = 0; i < 10; i++) {
        const wordNums = Math.floor(Math.random() * 140) + 1
        tweets.push({
          UserId: user.id,
          description: faker.lorem.words(wordNums),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    })
    await queryInterface.bulkInsert('Tweets', tweets)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
