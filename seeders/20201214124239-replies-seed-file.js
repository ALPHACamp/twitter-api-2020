'use strict';
const { User, Tweet } = require('../models/index')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' }, attributes: ['id'] })
    const tweets = await Tweet.findAll({ attributes: ['id'] })
    const userIds = users.map(u => u.id)
    const tweetIds = tweets.map(t => t.id)

    const { shuffleArray } = require('../utils/helpers')

    const replies = []

    for (const tweetId of tweetIds) {
      shuffleArray(userIds)
      const randomUserIds = userIds.slice(0, 3)
      for (const userId of randomUserIds) {
        replies.push({
          comment: 'This is seed reply',
          UserId: userId,
          TweetId: tweetId,
          updatedAt: new Date(),
          createdAt: new Date()
        })
      }
    }
    await queryInterface.bulkInsert('Replies', replies)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
