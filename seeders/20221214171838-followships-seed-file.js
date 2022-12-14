'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 預設每個使用者給10篇tweets Like
    const followingPerUser = 2
    // 從資料庫取得所有user
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    // 所有使用者Like數總和
    const totalFollowships = (users.length - 1) * followingPerUser

    await queryInterface.bulkInsert('Followships',
      Array.from({ length: totalFollowships }, (_, index) => {
        const selectPool = users
        const followerIndex = Math.floor(index / followingPerUser) + 1
        const followingSelectPool = selectPool.filter((_, i) => i !== 0 && i !== followerIndex)

        return (
          {
            follower_id: users[followerIndex].id,
            following_id: followingSelectPool[Math.floor(Math.random() * followingSelectPool.length)].id,
            created_at: new Date(),
            updated_at: new Date()
          }
        )
      }
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
