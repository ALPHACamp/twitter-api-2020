'use strict'
const faker = require('faker')

const { User, Tweet } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userIdList = (await User.findAll({ attributes: ['id'], raw: true })).slice(1)
    const tweetIdList = await Tweet.findAll({ attributes: ['id'] })
    const comment = []

    tweetIdList.forEach(tweet => {
      const randomPointer = ~~(Math.random() * userIdList.length)
        ;[0, 1, 2].forEach((item) => {
          item = (randomPointer + item) % userIdList.length
          comment.push({
            comment: faker.lorem.word(),
            UserId: userIdList[item].id,
            TweetId: tweet.id,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        })
    })

    await queryInterface.bulkInsert('Replies', comment)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, { truncate: true })
  }
}
