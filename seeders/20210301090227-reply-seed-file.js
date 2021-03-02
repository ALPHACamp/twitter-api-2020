'use strict'
const faker = require('faker')
const { User, Tweet} = require('../models/index')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 配對 User.id 對應到推文上 , 因為 Heroku User Models 亂數不確定性
    // User seed 由上而下建立 , 所以到這裡可以撈的到
    const users = await User.findAll({ raw: true, nest: true, where: { isAdmin: false } })
    const tweet = await Tweet.findAll({ raw: true, nest: true })
    const usersId = users.map(user => user.id)
    const tweetId = tweet.map(tweet => tweet.id)

    const reply = Array.from({ length: 30 }).map((item, index) =>
    ({
      UserId: Math.floor(Math.random() * 8) + 1,
      TweetId: Math.floor(Math.random() * 8) + 1,
      comment: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    })
    )
    await queryInterface.bulkInsert('Replies', reply)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
