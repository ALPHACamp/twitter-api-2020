'use strict'
const faker = require('faker')
const db = require('../models')
const User = db.User

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((d, i) =>
      ({
        id: i * 10 + 5,
        UserId: Math.floor(i / 10) * 10 + 15,
        description: faker.lorem.text().substring(0, 140),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
    await User.update({ tweetCount: 10 }, { where: { id: [15, 25, 35, 45, 55]}})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
    await User.update({ tweetCount: 0 }, { where: { id: [15, 25, 35, 45, 55] } })
  }
}