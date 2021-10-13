'use strict';
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
        userIds.unshift(user.id)
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
function userLikeTweets(userIds, tweetIds) {
  const allUserLikeTweets = []
  let tweetLimit = 0
  let avoidMiddleUser = 0
  userIds.forEach(userId => {
    if (avoidMiddleUser === 2) {
      tweetLimit = 40
    }
    for (let i = 0; i < 10; i++) {
      const userLikeTweet = {
        UserId: userId,
        TweetId: tweetIds[tweetLimit],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      if (tweetLimit > (tweetIds.length - 2)) {
        tweetLimit = 0
      } else {
        tweetLimit += 1
      }
      allUserLikeTweets.push(userLikeTweet)
    }
    avoidMiddleUser += 1
  })
  return allUserLikeTweets
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userIds = await getUserId
    const tweetIds = await getTweetId
    const likeSeed = userLikeTweets(userIds, tweetIds)
    await queryInterface.bulkInsert('Likes', likeSeed, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
};