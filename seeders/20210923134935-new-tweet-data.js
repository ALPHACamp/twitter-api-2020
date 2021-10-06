'use strict';
const faker = require('faker');
const db = require('../models')
const User = db.User

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

function userTweets(userIds) {
  const allUserTweets = []
  userIds.forEach(userId => {
    for (let i = 0; i < 10; i++) {
      const userTweet = {
        UserId: userId,
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      allUserTweets.push(userTweet)
    }
  })
  return allUserTweets
}


module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userIds = await getUserId
    const tweetSeed = userTweets(userIds)
    await queryInterface.bulkInsert('Tweets', tweetSeed, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};