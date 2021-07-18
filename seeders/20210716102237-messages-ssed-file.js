'use strict'
const faker = require('faker')
const functions = require('../config/functions')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Messages',
      Array.from({ length: 5 }).map((item, index) => ({
        id: index + 1,
        content: faker.lorem.text().substring(0, 30),
        UserId: Math.ceil(Math.random() * 5),
        createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
        updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Messages', null, {})
  }
}
