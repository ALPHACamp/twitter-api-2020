'use strict';

const faker = require('faker')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const getUserId = new Promise((resolve, reject) => {
  User.findAll({
    raw: true,
    nest: true,
    where: { role: 'user' }
  })
    .then(users => {
      const userIds = []
      users.forEach(user => {
        userIds.push(user.id)
      })
      return resolve(userIds)
    })
})
const getTweetId = new Promise((resolve, reject) => {
  Tweet.findAll({ raw: true, nest: true })
    .then(tweets => {
      const tweetIds = []
      tweets.forEach(tweet => {
        tweetIds.push(tweet.id)
      })
      return resolve(tweetIds)
    })
})

function tweetReplies(userIds, tweetIds) {
  const allTweetReplies = []
  let eachUserId = 0
  tweetIds.forEach(tweetId => {
    for (let i = 0; i < 3; i++) {
      const tweetReply = {
        UserId: userIds[eachUserId],
        TweetId: tweetId,
        comment: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      if (eachUserId > (userIds.length - 2)) {
        eachUserId = 1
      } else {
        eachUserId += 1
      }
      allTweetReplies.push(tweetReply)
    }
  })
  return allTweetReplies
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userIds = await getUserId
    const tweetIds = await getTweetId
    const tweetRepliesSeed = tweetReplies(userIds, tweetIds)

    await queryInterface.bulkInsert('Replies', tweetRepliesSeed, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}