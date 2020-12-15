'use strict'
const faker = require('faker')

const digit = 1
let tens = 0

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 180 }).map((d, i) =>
        ({
          id: i * 10 + 1,
          UserId: (i % 6) + 1,
          TweetId: i % 3 ? Number(tens - 1 + '' + digit) : Number((tens++) + '' + digit),
          comment: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
