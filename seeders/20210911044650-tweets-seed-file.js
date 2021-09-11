'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 50 }).map(
        (tweet, index) => ({
          id: index * 10 + 5,
          description: faker.lorem.sentence(3),
          userId: Math.ceil((index + 1) / 10) * 10 + 5,
          createdAt: new Date(),
          updatedAt: new Date()
        }),
        {}
      )
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, { truncate: true })
  }
}
