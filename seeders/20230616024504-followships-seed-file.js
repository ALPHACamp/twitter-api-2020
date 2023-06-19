'use strict'
const { User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' } }) // 避免資料庫 id 跳號
    const followCount = 3 // 每個user 有3人追蹤
    const followships = []
    for (const user of users) {
      // 取得當前使用者的 followerId
      const followerId = user.id
      // 取得其他隨機的 followingId
      const followingIdOptions = users
        .filter(u => u.id !== followerId)
        .map(u => u.id)
      const randomFollowingIds = getRandomElements(followingIdOptions, followCount)
      for (const followingId of randomFollowingIds) {
        followships.push({
          followerId,
          followingId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }

    await queryInterface.bulkInsert('Followships', followships)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Followships', null, {})
  }
}

const getRandomElements = (array, count) => {
  const shuffled = array.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}
