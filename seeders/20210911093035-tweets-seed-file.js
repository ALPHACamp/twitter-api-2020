'use strict'
const faker = require('faker')
const db = require('../models')
const User = db.User

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((d, i) =>
      ({
        UserId: Math.floor(i / 10) + 2,
        description: faker.lorem.text(),  
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
    await User.update({ tweetCount: 10 }, { where: { id: [2, 3, 4, 5, 6]}})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
    await User.update({ tweetCount: 0 }, { where: { id: [2, 3, 4, 5, 6] } })
  }
}