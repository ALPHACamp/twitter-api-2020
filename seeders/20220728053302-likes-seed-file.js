'use strict'
const { User, Tweet } = require('../models')
const { Op } = require("sequelize")
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({
      where: { [Op.not]: [{ role: 'admin' }] },
      attributes: ['id'],
      raw: true
    })
    const tweets = await Tweet.findAndCountAll()
    const likeList = []
    
    users.forEach(user => {
      likeList.push({
        user_id: user.id,
        tweet_id: tweets.rows[Math.floor(Math.random() * tweets.count)].id,
        created_at: new Date(),
        updated_at: new Date()
      })
    })

    await queryInterface.bulkInsert('Likes', likeList, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
}