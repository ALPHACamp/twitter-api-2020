'use strict';
const faker = require('faker')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll()
    const tweets = await Tweet.findAll()
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((d, i) =>
      ({
        comment: faker.lorem.sentences(),
        UserId: users[Math.floor(Math.random() * 5) + 1].id,
        TweetId: tweets[Math.floor(i / 3)].id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
