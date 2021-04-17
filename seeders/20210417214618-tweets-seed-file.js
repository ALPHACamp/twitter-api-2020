'use strict'

const db = require('../models')
const User = db.User

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll()

    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 50 }).map((d, i) => ({
        UserId: users[Math.floor(Math.random() * users.length)].id,
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
