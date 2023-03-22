'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const followships = []
    users.shift()
    users.forEach(user => {
      const { id: followerId } = user
      const followingUsers = users.filter(u => u.id !== followerId)
      const followingIds = []

      while (followingIds.length < 2) {
        const { id: followingId } = followingUsers[Math.floor(Math.random() * followingUsers.length)]
        if (!followingIds.includes(followingId)) {
          followingIds.push(followingId)
        }
      }

      followships.push(
        ...followingIds.map(followingId => ({
          follower_id: followerId,
          following_id: followingId,
          created_at: new Date(),
          updated_at: new Date()
        }))
      )
    })

    await queryInterface.bulkInsert('Followships', followships)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('followships', {})
  }
}
