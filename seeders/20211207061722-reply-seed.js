'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const mockReply = []
    const users = [10, 20, 30, 40, 50]
    let counter = 1

    for (let i = 0; i < 50; i++) {
      for (let j = 1; j < 4; j++) {
        let reply = {}
        if (users.length > 0) {
          reply = {
            id: counter * 10,
            comment: faker.lorem.sentences(),
            UserId: users[0],
            TweetId: (i + 1) * 10,
            createdAt: new Date(),
            updatedAt: new Date()
          }
          users.shift()
        } else {
          reply = {
            id: counter * 10,
            comment: faker.lorem.sentences(),
            UserId: (Math.floor(Math.random() * 4) + 1) * 10,
            TweetId: (i + 1) * 10,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
        mockReply.push(reply)
        counter++
      }
    }

    await queryInterface.bulkInsert('Replies', mockReply)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}