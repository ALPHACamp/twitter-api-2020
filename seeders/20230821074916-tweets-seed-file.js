'use strict'
const faker = require('faker')
const db = require('../models')
const User = db.User

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = []
    const userData = await User.findAll({
      raw: true,
      nest: true,
      attributes: ['id']
    })
    // eslint-disable-next-line array-callback-return
    Array.from({ length: 10 }).map((user, i) => {
      for (let j = 0; j < 10; ++j) {
        data.push({
          description: faker.lorem.text(140),
          created_at: new Date(),
          updated_at: new Date(),
          User_id: userData[i].id
        })
      }
    })

    await queryInterface.bulkInsert('Tweets', data)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
