'use strict'
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
      const users = await User.findAll({ where: { role: 'user' } })
      const tweets = await Tweet.findAll()
    await queryInterface.bulkInsert('Replies',
        Array.from({ length: 30 }).map((d, i) =>
            ({
                id: i * 10 + 1,
                TweetId: tweets[parseInt(i / 3)].id,
                comment: faker.lorem.text().substring(0, 140),
                UserId: i = 1 ? Math.floor(Math.random() * 5) * 10 + 11: i * 10 + 11,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
        ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}