'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminId = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role="admin";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const followships = []
    do {
      const randomFollowerId = users[Math.floor(Math.random() * users.length)].id
      const randomFollowingId = users[Math.floor(Math.random() * users.length)].id

      if (!followships.some(follow => follow.followerId === randomFollowerId && follow.followingId === randomFollowingId)) {
        // 不能 follow 自己以及 admin
        if (randomFollowerId !== randomFollowingId && !adminId.some(a => a.id === randomFollowerId || a.id === randomFollowingId)) {
          followships.push({
            follower_id: randomFollowerId,
            following_id: randomFollowingId,
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      }
    } while (followships.length < users.length * 2)

    await queryInterface.bulkInsert('Followships', followships)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
