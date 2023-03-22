'use strict'
const { User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userIdData = await User.findAll({ attributes: ['id'], raw: true })
    const followshipSeedData = []

    for (let i = 0; i < userIdData.length; i++) {
      // userIdData先排除自己 (followerId)
      let followingIdArr = userIdData.filter(item => item.id !== userIdData[i].id)
      for (let j = 0; j < 5; j++) {
        // 排序打亂
        followingIdArr = followingIdArr.sort(() => Math.random() - 0.5)
        // 因為排序打亂了，所以從index取id就可以實現隨機分配
        const followingId = followingIdArr[j].id
        followshipSeedData.push({
          follower_id: userIdData[i].id,
          following_id: followingId,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }

    await queryInterface.bulkInsert('Followships', followshipSeedData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships')
  }
}
