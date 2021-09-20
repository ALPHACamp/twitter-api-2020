'use strict';
const faker = require('faker')
const { User,Tweet } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await User.findAll({ attributes: ['id'] })
    const tweet = await Tweet.findAll({ attributes: ['id'] })
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 50 }).map((d, i) =>
      ({
        comment: faker.lorem.sentence(),
        UserId: user[~~(i / 10)].id,
        TweetId: tweet[~~(Math.random() * tweet.length)].id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
