'use strict'
const { User } = require('../models')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先確認User資料庫有多少個用戶，只取id和role
    let users = await User.findAll({
      attributes: ['id', 'role'],
      raw: true
    })
    // 只保留使用者，剃除管理者
    users = users.filter(user => user.role === 'user')
    const followships = []
    // 每名user新增三位跟隨者
    users.forEach(user => {
      // 檢查跟隨者(following)名單
      const existingFollowingIds = followships.filter(item => item.followerId === user.id).map(item => item.followingId)
      for (let i = 0; i < 3; i++) {
        let randomFollowingId = users[Math.floor(Math.random() * users.length)].id
        // 如果跟隨者是自己或是有重複的跟隨者(following)的話，就重新再跑一次random
        while (randomFollowingId === user.id || existingFollowingIds.includes(randomFollowingId)) { randomFollowingId = users[Math.floor(Math.random() * users.length)].id }
        followships.push({
          followerId: user.id,
          followingId: randomFollowingId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    })
    await queryInterface.bulkInsert('Followships', followships)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
