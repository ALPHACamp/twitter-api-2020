'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const reply = Array.from({ length: 30 }).map((item, index) =>
      ({
        UserId: Math.floor(Math.random() * 8) + 1,
        TweetId: Math.floor(Math.random() * 30) + 1,
        comment: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    )
    await queryInterface.bulkInsert('Replies', reply)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
