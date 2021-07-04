'use strict'
const faker = require('faker')
const { User } = require('../models')
const tweetCount = 10 // 每個 user 10 個 tweets
const userCount = 5 // 有 5 個 users
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' } }) // 避免資料庫 id 跳號
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: tweetCount * userCount }).map((_, i) => ({
        description: faker.lorem.sentences().substring(0, 140),
        UserId: users[Math.floor(i / 10)].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {}
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tweets', null, {})
  },
}
