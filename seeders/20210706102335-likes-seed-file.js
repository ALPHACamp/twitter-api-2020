'use strict'

const { User, Tweet, Sequelize } = require('../models')
const { Op } = Sequelize

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userIdList = (await User.findAll({ attributes: ['id'], raw: true, where: { role: { [Op.not]: 'admin' } } }))
    const tweetIdList = await Tweet.findAll({ attributes: ['id'] })

    await queryInterface.bulkInsert('Likes',
      Array.from({ length: 50 }, (v, i) => ({
        UserId: userIdList[~~(i / 10)].id,
        TweetId: tweetIdList[~~(Math.random() * tweetIdList.length)].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, { truncate: true })
  }
}
