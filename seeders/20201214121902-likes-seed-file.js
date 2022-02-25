'use strict';
const { User, Tweet } = require('../models/index')
const { shuffleArray } = require('../utils/helpers')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' }, attributes: ['id'] })
    const tweets = await Tweet.findAll({ attributes: ['id'] })

    const userIds = users.map(u => u.id)
    const tweetIds = tweets.map(t => t.id)

    const likes = []
    //each user randomly likes 10 tweets
    for (const UserId of userIds) {
      shuffleArray(tweetIds)
      const tweetPool = tweetIds.slice(0, 10)
      for (const TweetId of tweetPool) {
        likes.push({
          UserId: UserId,
          TweetId: TweetId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }
    await queryInterface.bulkInsert('Likes', likes)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
};
