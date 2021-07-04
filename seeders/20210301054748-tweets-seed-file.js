'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = Array.from({ length: 30 }).map((item, index) =>
      ({
        id: index,
        UserId: Math.floor(Math.random() * 8) + 1,
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    )
    await queryInterface.bulkInsert('Tweets', tweets)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
