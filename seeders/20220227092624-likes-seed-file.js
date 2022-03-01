'use strict';
const faker = require('faker')
const user = require('../models/user')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    //每篇推文都有1個使用者按喜歡
    await queryInterface.bulkInsert('Likes',
      Array.from({ length: tweets.length }, (_, i) => ({
        createdAt: new Date(),
        updatedAt: new Date(),
        TweetId: tweets[Math.floor(Math.random() * tweets.length)].id,
        UserId: users[Math.floor(Math.random() * users.length)].id,
        isDeleted: false
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
