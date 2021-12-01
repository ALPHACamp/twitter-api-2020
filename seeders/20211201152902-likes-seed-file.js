'use strict'
const { ARRAY } = require('sequelize')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

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
    let arr = Array.from({ length: 50 }).map((v, i) => ({
      UserId: Math.floor(Math.random() * userArray.length),
      TweetId: Math.floor(Math.random() * tweetArray.length),
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    for (let i = 0; i < arr.length; i++) {
      for (let a = i + 1; a < arr.length; a++) {
        if (
          arr[i].UserId === arr[a].UserId &&
          arr[i].TweetId === arr[a].TweetId
        ) {
          arr.splice(i, 1)
          i--
          a--
        }
      }
    }
    console.log(arr)

    await queryInterface.bulkInsert('Likes', arr, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
