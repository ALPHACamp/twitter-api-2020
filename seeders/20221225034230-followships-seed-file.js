'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role='user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const followerIdArr = []
    const followingIdArr = []

    while (followerIdArr.length < 30) {
      const followerId = users[Math.floor(Math.random() * users.length)].id
      const followingId = users[Math.floor(Math.random() * users.length)].id

      if (followerId !== followingId) {
        followerIdArr.push(followerId)
        followingIdArr.push(followingId)
      }
    }

    await queryInterface.bulkInsert('Followships',
      Array.from({ length: 30 }, (_, i) => ({
        follower_id: followerIdArr[i],
        following_id: followingIdArr[i],
        created_at: new Date(),
        updated_at: new Date()
      }))

    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
