'use strict';
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll()
    const tweets = await Tweet.findAll()
    await queryInterface.bulkInsert('Likes',
      Array.from({ length: 100 }).map((d, i) =>
      ({
        UserId: users[Math.floor(Math.random() * 5) + 1].id,
        TweetId: tweets[Math.floor(Math.random() * tweets.length)].id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
};
