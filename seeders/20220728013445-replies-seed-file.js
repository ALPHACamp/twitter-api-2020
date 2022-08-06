'use strict'
const faker = require('faker')
const { User, Tweet } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // get users' id and tweets' id
    const [users, tweets] = await Promise.all([
      User.findAll({ where: { role: 'user' }, attributes: ['id'], raw: true }),
      Tweet.findAll({ attributes: ['id'], raw: true })
    ])

    const repliesPerTweet = 3
    const tweetCount = tweets.length
    const userCount = users.length

    await queryInterface.bulkInsert('Replies',
      Array
        .from({ length: tweetCount * repliesPerTweet })
        .map((_reply, index) => ({
          UserId: users[index % userCount].id,
          TweetId: tweets[Math.floor(index / repliesPerTweet)].id,
          comment: faker.lorem.words(),
          createdAt: faker.date.recent(30),
          updatedAt: new Date()
        }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {}, { truncate: true })
  }
}
