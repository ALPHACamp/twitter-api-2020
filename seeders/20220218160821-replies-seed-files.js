'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Replies',
      //每篇有3個replies 總共50篇
      Array.from({ length: 150 }).map((reply, i) => ({
        id: i * 10 + 1,
        userId: Math.ceil(Math.random() * 5) * 10 + 1,
        tweetId: Math.floor(i / 3) * 10 + 1,
        comment: faker.lorem.text().substring(0, 140),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
