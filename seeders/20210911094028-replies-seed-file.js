'use strict'
const faker = require('faker')
const db = require('../models')
const Tweet = db.Tweet

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((d, i) =>
      ({
        UserId: i > 4 ? Math.floor(Math.random() * 5) + 2 : i + 2,
        TweetId: Math.floor(i / 3) + 1,
        comment: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
    await Tweet.update({ replyCount: 3 }, { where: { id: Array.from({ length: 50 }, (d, i) => i + 1) } })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
    await Tweet.update({ replyCount: 0 }, { where: { id: Array.from({ length: 50 }, (d, i) => i + 1) } })
  }
}