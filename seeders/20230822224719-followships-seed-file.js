'use strict'
const NumOfFollowingPerUser = 8 // 每個User隨機產生Follow數

const { QueryTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 取出所有user id存於陣列
    const users = await queryInterface.sequelize.query("SELECT id FROM Users where `role`='user'", { type: QueryTypes.SELECT })
    const userIds = users.map(user => user.id)

    // 每一個user隨機產生followings,要去自追蹤及重複
    const followships = []
    for (let i = 0; i < userIds.length; i++) {
      for (let j = 0; j < NumOfFollowingPerUser; j++) {
        followships.push({
          followerId: userIds[i],
          followingId: userIds[Math.floor(Math.random() * userIds.length)], // 從所有user id中隨機取一個,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }
    // 去自追蹤: 過濾掉follower和following相同的
    const filteredFollowships = followships.filter(v => v.followerId !== v.followingId)

    // 去重複: 去除followerId和followingId同時一致的 (先把物件字串化，再利用Map索引去重複的特性)
    const uniqFollowships = [...new Map(filteredFollowships.map(v => [JSON.stringify([v.followerId, v.followingId]), v])).values()]

    await queryInterface.bulkInsert('Followships', uniqFollowships)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
