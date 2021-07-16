'use strict'
const functions = require('../config/functions')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Followships',
      Array.from({ length: 10 }).map((item, index) => ({
        id: index + 1,
        followingId: index + 1,
        followerId: index + 2,
        createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
        updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
