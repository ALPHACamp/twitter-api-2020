'use strict';
const { User, Tweet } = require('../models/index')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' }, attributes: ['id'] })
    const tweets = await Tweet.findAll({ attributes: ['id'] })

    const userIds = users.map(u => u.id)
    const tweetIds = tweets.map(t => t.id)

    const likes = []

    for (let i = 0; i < 50; i++) {
      const randomUser = Math.floor(Math.random() * userIds.length)
      const randomTweet = Math.floor(Math.random() * tweetIds.length)
      likes.push({
        UserId: userIds[randomUser],
        TweetId: tweetIds[randomTweet],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    await queryInterface.bulkInsert('Likes', likes)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
};
