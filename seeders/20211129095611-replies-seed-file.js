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
                comment: faker.lorem.text().substring(0, 140),
                UserId: i !=1 ? Math.floor(Math.random() * 6) * 10 + 1 : i * 10 + 1,
                TweetId: tweets[parseInt(i / 3)].id,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
        ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}