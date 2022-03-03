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
      where: { role: 'user' },
      attributes: ['id']
    })

  await queryInterface.bulkInsert('Tweets', Array.from({ length: 50 }).map((d, i) => {
    const tweet = {
      userId: userData[Math.floor(i / 10)].id,
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
