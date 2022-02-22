/* eslint-disable space-infix-ops */
/* eslint-disable indent */
/* eslint-disable no-undef */
'use strict'
const faker = require('faker')
const db = require('../models')
const User = db.User

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userData = await User.findAll({
      raw: true,
      nest: true,
      where: { role: 'user' }
    })
      .then(user => user.map(i => i.id))
      await queryInterface.bulkInsert('Tweets', Array.from({ length: 50 }).map((d, i) => {
        let a = 0
        for (let b = i; b / 10 >= 1; b = b - 10) {
          a++
        }
        const tweet = {
          userId: userData[a],
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        return tweet
      }), {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tweets', null, {})
  }
}
