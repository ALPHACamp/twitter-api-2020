'use strict'

const faker = require('faker')
const functions = require('../config/functions')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 300 }).map((item, index) => ({
        id: index + 1,
        UserId: Math.ceil(Math.random() * 9) + 1,
        TweetId: Math.ceil((index + 1) / 3),
        comment: faker.lorem.text().substring(0, 50),
        createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
        updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
