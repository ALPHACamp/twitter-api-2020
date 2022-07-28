'use strict'
const { Op } = require('sequelize')
const { User } = require('../models')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({
      where: { [Op.not]: [{ role: 'admin' }] },
      attributes: ['id'],
      raw: true
    }) 
    const userIdList = users.map(user => user.id)
    const followships = []

    userIdList.forEach(userId => {
      const followingList = userIdList.filter(id => id !== userId)
      const length = followingList.length
      const usedPair = {}
      usedPair.follower_id = userId,
      usedPair.following_id = followingList[Math.floor(Math.random() * length)]
      usedPair.created_at = new Date(),
      usedPair.updated_at = new Date()
      followships.push(usedPair)
    })

    await queryInterface.bulkInsert('Followships', followships, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}