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
    Array.from({ length: 10 }).map((el, i) => {
      for (let i = 0; i < 10; ++i) {
        data.push({
          description: faker.lorem.text(140),
          created_at: new Date(),
          updated_at: new Date(),
          like_count: faker.datatype.number(),
          reply_count: faker.datatype.number(),
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
