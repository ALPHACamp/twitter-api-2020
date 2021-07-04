'use strict';
const faker = require('faker')
const bcrypt = require('bcryptjs')
const userNumber = 5
const userTweetNumber = 10
const userReplyNumber = 3

module.exports = {
  up: (queryInterface, Sequelize) => {
    //user
    queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'root',
      introduction: 'I am root.',
      role: 'admin',
      account: 'root',
      avatar: faker.image.avatar(),
      cover: faker.image.image(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, ...Array.from({ length: userNumber }).map((i, index) => ({
      email: `user${index + 1}@example.com`,
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: `user${index + 1}`,
      introduction: `I am user${index + 1}`,
      role: 'user',
      account: `user${index + 1}`,
      avatar: faker.image.avatar(),
      cover: faker.image.image(),
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    ], {})

    //tweet
    const userTweetArray = Array.from({ length: userNumber }).map((i, index) => {
      const tweet = []
      for (let j = 1; j <= userTweetNumber; j++) {
        tweet.push({
          UserId: `${index + 2}`,
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
      return tweet
    })
    const totalTweet = []
    userTweetArray.forEach(tweet => {
      tweet.forEach(i => {
        totalTweet.push(i)
      })
    })
    queryInterface.bulkInsert('Tweets', totalTweet, {})

    //reply
    const userReplyArray = Array.from({ length: userNumber * userTweetNumber }).map((i, index) => {
      const reply = []
      const userId = []
      for (let j = 2; j <= userNumber + 1; j++) {
        userId.push(j)
      }
      for (let k = 1; k <= userReplyNumber; k++) {
        const random = Math.floor(Math.random() * userId.length)
        reply.push({
          UserId: userId[random],
          TweetId: `${index + 1}`,
          comment: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
        userId.splice(userId.indexOf(userId[random]), 1)
      }
      return reply
    })
    const totalReply = []
    userReplyArray.forEach(reply => {
      reply.forEach(i => {
        totalReply.push(i)
      })
    })
    return queryInterface.bulkInsert('Replies', totalReply, {})
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {})
    queryInterface.bulkDelete('Tweets', null, {})
    return queryInterface.bulkDelete('Replies', null, {})
  }
};
