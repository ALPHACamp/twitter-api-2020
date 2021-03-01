'use strict'
const faker = require('faker')
const { User } = require('../models/index')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 配對 User.id 對應到推文上 , 因為 Heroku User Models 亂數不確定性
    // User seed 由上而下建立 , 所以到這裡可以撈的到
    const users = await User.findAll({ raw: true, nest: true, where: { isAdmin: false } })
    const usersId = users.map(user => user.id)
   
      const tweets = Array.from({ length: 10 }).map((item, index) =>
      ({
        UserId: usersId[index],
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      )
    await queryInterface.bulkInsert('Tweets', tweets)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}