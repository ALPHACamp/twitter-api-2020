'use strict'
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: null } })
    const tweets = await Tweet.findAll()
    let userArray = []
    let tweetArray = []
    for (let user of users) {
      userArray.push(user.id)
    }
    for (let tweet of tweets) {
      tweetArray.push(tweet.id)
    }

    console.log(userArray)
    await queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 150 }).map((d, i) => {
        var a = 0
        for (let b = i; b / 3 >= 1; b = b - 3) {
          a++
        }
        let reply = {
          comment: faker.lorem.text().substring(0, 10),
          UserId: userArray[Math.floor(Math.random() * userArray.length)],
          TweetId: tweetArray[a],
          createdAt: new Date(),
          updatedAt: new Date()
        }
        return reply
      }),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
