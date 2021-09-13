'use strict'
const faker = require('faker')
// 每個使用者有 10 篇 post
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 100 }).map((d, index) =>
        ({
          id: index * 10 + 1,
          UserId: Math.ceil((index + 1) / 10) * 10 + 1,
          description: faker.lorem.sentence(5),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
