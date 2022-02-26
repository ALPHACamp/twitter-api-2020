'use strict'
const { Op } = require('sequelize')
const { User, Tweet } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await User.findAll({ where: { [Op.not]: [{ role: 'admin' }] }, attributes: ['id'] })
    let userIdList = []
    for (const user of users) { userIdList.push(user.id) }

    await queryInterface.bulkInsert('Likes',
      tweets.flatMap(tweet => {
        return Array.from({ length: Math.floor(Math.random() * userIdList.length) + 1 }).map((v, i) => ({
          UserId: userIdList[i],
          TweetId: tweet.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      }), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}
