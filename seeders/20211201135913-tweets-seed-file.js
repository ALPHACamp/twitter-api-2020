'use strict'
const db = require('../models')
const User = db.User
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: null } })
    let userArray = []
    for (let user of users) {
      userArray.push(user.id)
    }
    console.log(userArray)
    await queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 50 }).map((d, i) => {
        var a = 0
        for (let b = i; b / 10 >= 1; b = b - 10) {
          a++
        }
        let tweet = {
          description: faker.lorem.text().substring(0, 30),
          UserId: userArray[a],
          createdAt: new Date(),
          updatedAt: new Date()
        }
        console.log(tweet)
        return tweet
      }),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
