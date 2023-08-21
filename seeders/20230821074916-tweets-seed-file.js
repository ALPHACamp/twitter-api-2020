'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = []
    Array.from({ length: 5 }).map((user, i) => {
      for (let j = 0; j < 10; ++j) {
        data.push({
          id: j * 10 + i + 1,
          description: faker.lorem.text(140),
          createdAt: new Date(),
          updatedAt: new Date(),
          UserId: i + 1
        })
      }
    })
    await queryInterface.bulkInsert('Tweets', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
