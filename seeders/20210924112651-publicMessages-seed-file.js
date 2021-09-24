'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Messages',
      Array.from({ length: 5 }).map((messages, index) => ({
        id: index * 10 + 5,
        UserId: (index + 1) * 10 + 5,
        RoomId: 5,
        isRead: false,
        content: faker.lorem.sentence(3),
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Messages', null, { truncate: true })
  }
}
