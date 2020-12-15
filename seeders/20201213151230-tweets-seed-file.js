'use strict'
const faker = require('faker')
let digit = 1
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 60 }).map((d, i) =>
        ({
          id: i * 10 + 1,
          UserId: (i + 1) % 10 ? digit : digit++,
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
