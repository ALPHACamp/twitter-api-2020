'use strict'
const faker = require('faker')
const functions = require('../config/functions')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((item, index) => ({
        id: index + 1,
        UserId: Math.ceil((index + 1) / 10),
        description: faker.lorem.text().substring(0, 140),
        createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
        updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
