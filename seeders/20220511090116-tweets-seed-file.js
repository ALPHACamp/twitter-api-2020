'use strict'

const db = require('../models')
const User = db.User

const faker = require('faker')
const tweet = require('../models/tweet')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' } })

    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 50 }).map((item, index) => ({
        id: index + 1,
        UserId: Math.ceil(( index + 1) / 10),
        description: faker.lorem.text().substring(0, 140),
        likeCount: 5,
        replyCount: 3,
        createdAt: new Date(),
        updatedAt: new Date(),

      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {
      where: {},
      truncate: true,
    })
  },
}
