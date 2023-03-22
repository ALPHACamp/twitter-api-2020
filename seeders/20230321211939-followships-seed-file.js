'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userFollowingCounts = 3
    // 從資料庫取得所有user
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // 所有使用者Followships數總和
    const totalFollowships = users.length * userFollowingCounts

    await queryInterface.bulkInsert(
      'Followships',
      Array.from({ length: totalFollowships }, (_, index) => {
        const selectPool = users
        const followerIndex = Math.floor(index / userFollowingCounts)
        const followingSelectPool = selectPool.filter(
          (_, i) => i !== 0 && i !== followerIndex
        )
        return {
          follower_id: users[followerIndex].id,
          following_id:
            followingSelectPool[
              Math.floor(Math.random() * followingSelectPool.length)
            ].id,
          created_at: new Date(),
          updated_at: new Date()
        }
      }),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
