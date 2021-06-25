'use strict'

const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' } })
    const tweets = await Tweet.findAll()

    await queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 150 }).map((d, i) => ({
        UserId: users[i % 5].id,
        TweetId: tweets[parseInt(i / 3)].id,
        comment: faker.lorem.text().substring(0, 50),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {
      where: {},
      truncate: true
    })
  }
}
