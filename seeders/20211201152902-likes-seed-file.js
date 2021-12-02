'use strict'
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const _ = require('lodash')

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
    let arr = Array.from({ length: 100 }).map((v, i) => ({
      UserId: userArray[_.random(userArray.length - 1)],
      TweetId: tweetArray[_.random(tweetArray.length - 1)],
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    const uniqArr = _.uniqBy(arr, a => {
      return a.UserId + a.TweetId
    })

    await queryInterface.bulkInsert('Likes', uniqArr, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
